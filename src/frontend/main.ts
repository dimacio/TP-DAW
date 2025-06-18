// NOTA: Se ha eliminado la línea "import M from 'materialize-css';"
// La librería se carga desde el CDN en index.html, y los tipos (@types/materialize-css)
// hacen que TypeScript reconozca el objeto global 'M' sin necesidad de importarlo.

// --- CHECKPOINT: Interfaces y Tipos ---
interface Device {
    id: number;
    nombre_id: string;
    ubicacion: string;
    tipo: string;
    estado: 0 | 1;
    nivel: number;
}

// --- CHECKPOINT: Constantes de la API ---
const API_URL = '/devices/'; 

// --- CHECKPOINT: Elementos del DOM (Tipados) ---
const devicesContainer = document.getElementById('devices-container') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;
const deviceCardTemplate = document.getElementById('device-card-template') as HTMLTemplateElement;
const createCardTemplate = document.getElementById('create-card-template') as HTMLTemplateElement;

// Modal de Edición/Creación
const deviceModalElem = document.getElementById('device-modal') as HTMLDivElement;
const modalTitle = document.getElementById('modal-title') as HTMLHeadingElement;
const deviceNameInput = document.getElementById('device-name') as HTMLInputElement;
const deviceLocationInput = document.getElementById('device-location') as HTMLInputElement;
const deviceTypeSelect = document.getElementById('device-type') as HTMLSelectElement;
const saveDeviceBtn = document.getElementById('save-device-btn') as HTMLButtonElement;

// Modal de Confirmación de Borrado
const confirmDeleteModalElem = document.getElementById('confirm-delete-modal') as HTMLDivElement;
const confirmDeleteBtn = document.getElementById('confirm-delete-btn') as HTMLButtonElement;


// --- CHECKPOINT: Estado de la Aplicación ---
let deviceModalInstance: M.Modal;
let confirmDeleteModalInstance: M.Modal;
let editingDevice: Device | null = null;
let deviceToDeleteId: number | null = null;
let availableDeviceTypes: string[] = [];

// Diccionario de Íconos
const ICONS: { [key: string]: string } = {
    'lampara': 'lightbulb',
    'ventilador': "loop",
    'calefactor': 'whatshot',
    'default': 'settings_remote'
};

// --- CHECKPOINT: Funciones de la API (con manejo de errores mejorado) ---
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ error: 'Error desconocido' }));
            throw new Error(errorBody.error || `HTTP error! status: ${response.status}`);
        }
        if (response.status === 204) { // No Content
            return null as T;
        }
        return await response.json() as T;
    } catch (error) {
        M.toast({ html: (error as Error).message, classes: 'red' });
        throw error;
    }
}

const fetchDevices = () => apiFetch<Device[]>(API_URL);
const fetchDeviceTypes = () => apiFetch<string[]>(`${API_URL}types`);
const updateDevice = (id: number, data: Partial<Device>) => apiFetch<Device>(`${API_URL}${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
const createDevice = (data: Omit<Device, 'id'>) => apiFetch<Device>(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
const deleteDevice = (id: number) => apiFetch<null>(`${API_URL}${id}`, { method: 'DELETE' });


// --- Funciones de Renderizado ---
function renderDeviceCard(device: Device) {
    const cardClone = deviceCardTemplate.content.cloneNode(true) as DocumentFragment;
    const cardWrapper = cardClone.querySelector('.device-card-wrapper') as HTMLDivElement;
    
    cardWrapper.dataset.deviceId = device.id.toString();

    const icon = cardWrapper.querySelector('.device-icon') as HTMLElement;
    icon.textContent = ICONS[device.tipo] || ICONS.default;
    icon.classList.toggle('active', !!device.estado);

    (cardWrapper.querySelector('.device-name') as HTMLSpanElement).textContent = device.nombre_id;
    (cardWrapper.querySelector('.device-location') as HTMLParagraphElement).textContent = device.ubicacion;

    const stateSwitch = cardWrapper.querySelector('.device-state') as HTMLInputElement;
    stateSwitch.checked = !!device.estado;
    stateSwitch.dataset.deviceId = device.id.toString();

    const levelSlider = cardWrapper.querySelector('.device-level') as HTMLInputElement;
    levelSlider.value = device.nivel.toString();
    levelSlider.dataset.deviceId = device.id.toString();
    (cardWrapper.querySelector('.device-level-value') as HTMLSpanElement).textContent = device.nivel.toString();

    (cardWrapper.querySelector('.edit-btn') as HTMLAnchorElement).dataset.deviceId = device.id.toString();
    (cardWrapper.querySelector('.delete-btn') as HTMLAnchorElement).dataset.deviceId = device.id.toString();
    
    devicesContainer.appendChild(cardClone);
}

function renderAll(devices: Device[]) {
    devicesContainer.innerHTML = '';
    devices.forEach(renderDeviceCard);
    const createCardClone = createCardTemplate.content.cloneNode(true);
    devicesContainer.appendChild(createCardClone);
}

// --- Lógica de Modales ---
function openCreateModal() {
    editingDevice = null;
    modalTitle.textContent = 'Crear Dispositivo';
    deviceNameInput.value = '';
    deviceLocationInput.value = '';
    deviceNameInput.disabled = false;
    
    deviceTypeSelect.innerHTML = '<option value="" disabled selected>Elige un tipo</option>';
    availableDeviceTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        deviceTypeSelect.appendChild(option);
    });
    
    M.FormSelect.init(deviceTypeSelect);
    deviceModalInstance.open();
}

function openEditModal(device: Device) {
    editingDevice = device;
    modalTitle.textContent = 'Editar Dispositivo';
    deviceNameInput.value = device.nombre_id;
    deviceLocationInput.value = device.ubicacion;
    deviceNameInput.disabled = true;

    deviceTypeSelect.innerHTML = '';
    availableDeviceTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        if (type === device.tipo) option.selected = true;
        deviceTypeSelect.appendChild(option);
    });
    
    M.FormSelect.init(deviceTypeSelect);
    deviceModalInstance.open();
    M.updateTextFields();
}

async function handleSaveDevice() {
    const data = {
        nombre_id: deviceNameInput.value.trim(),
        ubicacion: deviceLocationInput.value.trim(),
        tipo: deviceTypeSelect.value,
        estado: editingDevice?.estado ?? 0,
        nivel: editingDevice?.nivel ?? 0,
    };

    if (!data.nombre_id || !data.ubicacion || !data.tipo) {
        M.toast({ html: 'Por favor, completa todos los campos', classes: 'orange' });
        return;
    }

    try {
        if (editingDevice) {
            const updated = await updateDevice(editingDevice.id, data);
            M.toast({ html: `Dispositivo '${updated.nombre_id}' actualizado`, classes: 'green' });
        } else {
            const created = await createDevice(data);
            M.toast({ html: `Dispositivo '${created.nombre_id}' creado`, classes: 'green' });
        }
        deviceModalInstance.close();
        await initialize();
    } catch (e) { /* El error ya se muestra en apiFetch */ }
}

function openConfirmDeleteModal(id: number) {
    deviceToDeleteId = id;
    confirmDeleteModalInstance.open();
}

async function handleConfirmDelete() {
    if (deviceToDeleteId === null) return;
    try {
        await deleteDevice(deviceToDeleteId);
        M.toast({ html: 'Dispositivo eliminado!', classes: 'orange' });
        document.querySelector(`.device-card-wrapper[data-device-id="${deviceToDeleteId}"]`)?.remove();
    } catch (e) { /* El error ya se muestra en apiFetch */ }
    confirmDeleteModalInstance.close();
    deviceToDeleteId = null;
}

// --- Event Listeners ---
function setupEventListeners() {
    devicesContainer.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.create-card-panel')) {
            openCreateModal();
            return;
        }
        
        const deviceIdStr = target.dataset.deviceId || target.closest<HTMLElement>('[data-device-id]')?.dataset.deviceId;
        if (!deviceIdStr) return;
        const deviceId = parseInt(deviceIdStr, 10);

        if (target.matches('.edit-btn')) {
            e.preventDefault();
            const devices = await fetchDevices();
            const deviceToEdit = devices.find(d => d.id === deviceId);
            if(deviceToEdit) openEditModal(deviceToEdit);
        }

        if (target.matches('.delete-btn')) {
            e.preventDefault();
            openConfirmDeleteModal(deviceId);
        }
    });

    devicesContainer.addEventListener('change', async (e) => {
        const target = e.target as HTMLInputElement;
        const deviceIdStr = target.dataset.deviceId;
        if (!deviceIdStr) return;
        const deviceId = parseInt(deviceIdStr, 10);
        
        const cardWrapper = document.querySelector(`.device-card-wrapper[data-device-id="${deviceId}"]`);
        if (!cardWrapper) return;
        
        const devices = await fetchDevices();
        const deviceToUpdate = devices.find(d => d.id === deviceId);
        if (!deviceToUpdate) return;
        
        if (target.matches('.device-state')) {
            (cardWrapper.querySelector('.device-icon') as HTMLElement).classList.toggle('active', target.checked);
            deviceToUpdate.estado = target.checked ? 1 : 0;
            updateDevice(deviceId, deviceToUpdate);
        }
    });
    
    devicesContainer.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
         if (target.matches('.device-level')) {
            const deviceIdStr = target.dataset.deviceId;
            if (!deviceIdStr) return;
             const cardWrapper = document.querySelector(`.device-card-wrapper[data-device-id="${deviceIdStr}"]`);
             if (cardWrapper) (cardWrapper.querySelector('.device-level-value') as HTMLSpanElement).textContent = target.value;
         }
    });
    
     devicesContainer.addEventListener('mouseup', async (e) => {
        const target = e.target as HTMLInputElement;
        if (target.matches('.device-level')) {
            const deviceIdStr = target.dataset.deviceId;
            if (!deviceIdStr) return;
            const deviceId = parseInt(deviceIdStr, 10);
            
            const devices = await fetchDevices();
            const deviceToUpdate = devices.find(d => d.id === deviceId);
            if(deviceToUpdate) {
                deviceToUpdate.nivel = Number(target.value);
                updateDevice(deviceId, deviceToUpdate);
            }
        }
    });

    saveDeviceBtn.addEventListener('click', handleSaveDevice);
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
}

// --- Función Principal de Inicialización ---
async function initialize() {
    loader.style.display = 'block';
    devicesContainer.style.display = 'none';

    try {
        const [devices, deviceTypes] = await Promise.all([
            fetchDevices(),
            fetchDeviceTypes()
        ]);
        availableDeviceTypes = deviceTypes;
        renderAll(devices);
    } catch (error) {
        console.error("Fallo la inicialización:", error)
    } finally {
        loader.style.display = 'none';
        devicesContainer.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    M.Modal.init(deviceModalElem);
    M.Modal.init(confirmDeleteModalElem);
    deviceModalInstance = M.Modal.getInstance(deviceModalElem);
    confirmDeleteModalInstance = M.Modal.getInstance(confirmDeleteModalElem);
    
    initialize();
    setupEventListeners();
});

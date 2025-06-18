curl -X PUT -H "Content-Type: application/json" -d '{
      "nombre_id": "lampara-living-principal",
      "ubicacion": "Living Room",
      "estado": 1,
      "nivel": 95
    }' http://localhost:8000/devices/1
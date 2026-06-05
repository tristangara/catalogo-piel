// Importamos las librerías
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Inicializamos Express
const app = express();
// El CORS nos permite que tu futura página web pueda pedirle datos a este servidor sin que el navegador lo bloquee
app.use(cors());
app.use(express.json());

// Conexión a Supabase jalando las variables secretas de tu .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta principal para pedir el catálogo de bolsas
app.get('/api/productos', async (req, res) => {
    try {
        // Hacemos la consulta a la tabla 'productos' en Supabase
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('disponible', true); // Filtramos para traer solo las que están disponibles

        // Si la base de datos se queja de algo, lanzamos el error
        if (error) throw error;
        
        // Si todo sale bien, le regresamos la info de las bolsas al cliente en formato JSON
        res.json(data);
    } catch (error) {
        console.error("Hubo un error al consultar Supabase:", error);
        res.status(500).json({ error: error.message });
    }
});

// Levantamos el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`¡Servidor del catálogo corriendo en http://localhost:${PORT} 🚀!`);
});
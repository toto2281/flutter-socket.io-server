const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Mal País'));
bands.addBand(new Band('Suite Doble'));
bands.addBand(new Band('Percance'));
bands.addBand(new Band('Tango India'));

// console.log(bands);

//Mensajes de Sockets
io.on('connection', client => { 

    console.log('Cliente Conectado');
    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
     });

    client.on('mensaje', (payload) => {
      console.log('Mensaje', payload);
      io.emit('mensaje', {admi: 'Nuevo Usuario Registrado'});
    });

    client.on('emitir-mensaje', (payload) => {
      console.log('Acción de Emitir Mensaje');
      // io.emit('nuevo-mensaje', payload); // Emite a todos
      client.broadcast.emit('nuevo-mensaje', payload); // Emite a todos menos al que envió el mensaje
    });

    client.on('vote-band', (payload) => {
      bands.voteBand(payload.id);  
      io.emit('active-bands', bands.getBands());
      // console.log(payload);
    });

    client.on('add-band', (payload) => {
      bands.addBand(new Band(payload.name));
      // bands.addBand(payload.name);  
      io.emit('active-bands', bands.getBands());
      // console.log(payload.name);
    });

    client.on('delete-band', (payload) => {
      bands.deleteBand(payload.id);
      io.emit('active-bands', bands.getBands());
      // console.log(payload.name);
    });

    client.on('event_name', (payload) => {
      console.log('Mensaje recibido de Arduino', payload.now);
    });

    client.on('led_state', (payload) =>{
        console.log('Controlador Led', payload)
        if(payload == true) {
          client.broadcast.emit("Led", {"state":"On"});
        } else {
          client.broadcast.emit("Led", {"state":"Off"});
        }
        
    });
    client.on('color_flutter', (payload) =>{
        console.log('Controlador Led', payload)
        // client.broadcast.emit("style_flutter", payload);
        io.emit("style_flutter", payload);
    });


  });
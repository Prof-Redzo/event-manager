import fs from "fs";
import { generateUUID } from "../helpers/index.js";

export const getEvents = (req, res) => {
  try{
    const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  const { events } = db;

  res.send(events);
 } catch(e) {
   console.log(e);
   res.status(500).send("Something went wrong");
 } 
}

export const createEvent = (req, res) => {
   try {
  const event = req.body;
  const id = generateUUID();
  const newEvent = {...event, id};

   const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

   db.events.push(newEvent);

   fs.writeFileSync("./db.json", JSON.stringify(db, null, "\t"));
  
   res.status(201).send(newEvent);
  } catch(e) {
    res.status(500).send("Could not create an event");
  }
}

export const getEventById = (req, res) => {
  try {
  const { id } = req.params;

  const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  const { events } = db;

  const event = events.find((event) => event.id === id);

  if(event){
    res.send(event);
  } else {
    res.status(404).send("Event not found");
  }
} catch(e) {
 res.status(500).send("Something went wrong");
}
};

export const updateEvent = (req, res) => {
  const {id} = req.params;
  const event = req.body;

  try{
    const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

    const eventIndex = db.events.findIndex((event) => event.id === id);

    db.events[eventIndex] = event;

    fs.writeFileSync("./db.json", JSON.stringify(db, null, "\t"));

    res.send(event);
  } catch(e) {
   res.status(500).send("Could not update event");
  }
};

export const deleteEvent = (req, res) => {
  const {id} = req.params;

  try{
    const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

    const eventIndex = db.events.findIndex((event) => event.id === id);

    if(eventIndex !== -1) {
      db.events.splice(eventIndex, 1);

      fs.writeFileSync("./db.json", JSON.stringify(db, null, "\t"));

      res.status(204).send();
    } else {
      res.status(404).send("Event not found");
    }
     
  } catch(e) {
   res.status(500).send("Could not delete event");
  }
};

//export const registerAttendee = (req, res) => {
  //const {id} = req.params;

  //try{
    //const db = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

   // const eventIndex = db.events.findIndex((event) => event.id === id);

   // db.events[eventIndex].registeredUsersCounter +=1;

   // fs.writeFileSync("./db.json", JSON.stringify(db, null, "\t"));

    //res.send({registeredUsersCounter: db.events[eventIndex].registeredUsersCounter});

  //} catch(e) {
    //res.status(500).send("Could not register attendee");
  //}
//};
export const registerAttendee = (req, res) => {
  const { id } = req.params;

  try {
      const db = JSON.parse(fs.readFileSync('./db.json', 'utf-8'));
      const eventIndex = db.events.findIndex((event) => event.id === id);

      if (db.events[eventIndex].registeredUsersCounter >= db.events[eventIndex].registrationLimit) {
          res.status(400).send('Maximum number of attendees reached');
          return; 
      }

      db.events[eventIndex].registeredUsersCounter += 1;
      fs.writeFileSync('./db.json', JSON.stringify(db, null, '\t'));

      res.send({ registeredUsersCounter: db.events[eventIndex].registeredUsersCounter });
  } catch (error) {
      console.error(error);
      res.status(500).send('Could not register attendee');
  }
};
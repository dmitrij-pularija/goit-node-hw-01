const { readFile, writeFile } = require("fs/promises");
const { nanoid } = require("nanoid");

const path = require("path");
const contactsPath = path.resolve("./db/contacts.json");

const listContacts = async () => {
  try {
    const contacts = await readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    console.error(error);
  }
};

const getContactById = async (id) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((item) => item.id === id);
    return contact || null;
  } catch ({ message }) {
    console.log("Error: ", message);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts();
    const dublName = contacts.find(
      (contact) => contact.name.toUpperCase() === name.toUpperCase()
    );
    const dublEmail = contacts.find((contact) => contact.email === email);
    const dublPhone = contacts.find((contact) => contact.phone === phone);

    if (dublName) throw new Error("Name already exists");
    if (dublEmail) throw new Error("Email already exists");
    if (dublPhone) throw new Error("Phone already exists");

    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch ({ message }) {
    console.log("Error: ", message);
  }
};

const removeContact = async (id) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === id);

    if (index === -1) throw new Error("Unable to delete non-existent contact");
    const removedContact = contacts.splice(index, 1);
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
  } catch ({ message }) {
    console.log("Error: ", message);
  }
};

module.exports = { listContacts, getContactById, removeContact, addContact };
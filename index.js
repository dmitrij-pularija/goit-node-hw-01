const { Command } = require("commander");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts.js");

const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();
console.log("argv: ", argv);

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      const contacts = await listContacts();
      return console.table(contacts);

    case "get":
      const contact = await getContactById(id);
      if (contact) return console.table([contact]);
      else return console.log("No such contact");

    case "add":
      const newContact = await addContact(name, email, phone);
      if (newContact) {
        console.log("Contact added successfully");
        return console.table([newContact]);
      }
      break;

    case "remove":
      const removedContact = await removeContact(id);
      if (removedContact) {
        console.log("Contact successfully removed");
        return console.table(removedContact);
      }
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
};

invokeAction(argv);
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(`${__dirname}/db/contacts.json`);

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error reading contacts file");
  }
}

async function getContactById(contactId) {
  try {
    const allContacts = await listContacts();
    const contact = allContacts.find(({ id }) => id === contactId);
    return contact;
  } catch (error) {
    throw new Error("Error getting contact by ID");
  }
}
async function removeContact(contactId) {
  try {
    const allContacts = await listContacts();
    const index = allContacts.findIndex(({ id }) => id === contactId);
    if (index === -1) {
      throw new Error("Contact not found");
    }
    const [result] = allContacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
    return result;
  } catch (error) {
    throw new Error("Error removing contact");
  }
}

async function addContact(name, email, phone) {
  try {
    const allContacts = await listContacts();

    const newContact = {
      id: nanoid(),
      name: name,
      email: email,
      phone: phone,
    };

    const newContacts = allContacts.push(newContact);

    await fs.appendFile(contactsPath, JSON.stringify(newContacts, null, 2));
  } catch (error) {
    throw new Error("Error adding contact");
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

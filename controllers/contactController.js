const axios = require("axios");
const pool = require("../config/db");
require("dotenv").config();

// Create Contact
function createContact(req, res) {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;
  
    console.log(`Received request to create contact in ${data_store}`);
  
    try {
      switch (data_store) {
        case "CRM":
          axios.post(
            "https://abhigyan.myfreshworks.com/crm/sales/api/contacts",
            {
              first_name,
              last_name,
              email,
              mobile_number,
            },
            {
              headers: {
                Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
              },
            }
          )
          .then(response => {
            console.log("Successfully created contact in CRM:", response.data);
            res.status(201).json(response.data);
          })
          .catch(error => {
            console.error("Failed to create contact in CRM:", error.response.data);
            res.status(500).json({ success: false, message: error.message });
          });
          break;
  
        case "DATABASE":
          pool.query(
            "INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)",
            [first_name, last_name, email, mobile_number],
            (error, result) => {
              if (error) {
                console.error("Failed to create contact in Database:", error.message);
                return res.status(500).json({ success: false, message: error.message });
              }
  
              console.log("Successfully created contact in Database:", {
                id: result.insertId,
                first_name,
                last_name,
                email,
                mobile_number,
              });
              res.status(201).json({
                id: result.insertId,
                first_name,
                last_name,
                email,
                mobile_number,
              });
            }
          );
          break;
  
        default:
          console.log("Invalid data_store value provided:", data_store);
          res.status(400).json({ success: false, message: "Invalid data_store value" });
          break;
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

// Retrieve Contact
function getContact(req, res) {
    const { contact_id, data_store } = req.body;
  
    console.log(`Received request to retrieve contact from ${data_store} with contact_id: ${contact_id}`);
  
    try {
      switch (data_store) {
        case "CRM":
          axios.get(
            `https://abhigyan.myfreshworks.com/crm/sales/api/contacts/${contact_id}`,
            {
              headers: {
                Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
              },
            }
          )
          .then(response => {
            console.log("Successfully retrieved contact from CRM:", response.data);
            res.status(200).json(response.data);
          })
          .catch(error => {
            console.error("Failed to retrieve contact from CRM:", error.response.data);
            res.status(500).json({ success: false, message: error.message });
          });
          break;
  
        case "DATABASE":
          pool.query("SELECT * FROM contacts WHERE id = ?", [contact_id], (error, rows) => {
            if (error) {
              console.error("Failed to retrieve contact from Database:", error.message);
              return res.status(500).json({ success: false, message: error.message });
            }
  
            if (rows.length === 0) {
              console.log("Contact not found in Database with id:", contact_id);
              return res.status(404).json({ message: "Contact not found" });
            }
  
            console.log("Successfully retrieved contact from Database:", rows[0]);
            res.status(200).json(rows[0]);
          });
          break;
  
        default:
          console.log("Invalid data_store value provided:", data_store);
          res.status(400).json({ success: false, message: "Invalid data_store value" });
          break;
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }

// Update Contact
function updateContact(req, res) {
    const { contact_id, new_email, new_mobile_number, data_store } = req.body;
  
    console.log(`Received request to update contact in ${data_store} with contact_id: ${contact_id}`);
  
    try {
      switch (data_store) {
        case "CRM":
          axios.put(
            `https://abhigyan.myfreshworks.com/crm/sales/api/contacts/${contact_id}`,
            {
              email: new_email,
              mobile_number: new_mobile_number,
            },
            {
              headers: {
                Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
              },
            }
          )
          .then(response => {
            console.log("Successfully updated contact in CRM:", response.data);
            res.status(200).json(response.data);
          })
          .catch(error => {
            console.error("Failed to update contact in CRM:", error.response.data);
            res.status(500).json({ success: false, message: error.message });
          });
          break;
  
        case "DATABASE":
          pool.query(
            "UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?",
            [new_email, new_mobile_number, contact_id],
            (error, result) => {
              if (error) {
                console.error("Failed to update contact in Database:", error.message);
                return res.status(500).json({ success: false, message: error.message });
              }
  
              if (result.affectedRows === 0) {
                console.log("Contact not found in Database with id:", contact_id);
                return res.status(404).json({ message: "Contact not found" });
              }
  
              console.log("Successfully updated contact in Database:", {
                id: contact_id,
                new_email,
                new_mobile_number,
              });
              res.status(200).json({ id: contact_id, new_email, new_mobile_number });
            }
          );
          break;
  
        default:
          console.log("Invalid data_store value provided:", data_store);
          res.status(400).json({ success: false, message: "Invalid data_store value" });
          break;
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  

// Delete Contact
function deleteContact(req, res) {
    const { contact_id, data_store } = req.body;
  
    console.log(`Received request to delete contact from ${data_store} with contact_id: ${contact_id}`);
  
    try {
      switch (data_store) {
        case "CRM":
          axios.delete(
            `https://abhigyan.myfreshworks.com/crm/sales/api/contacts/${contact_id}`,
            {
              headers: {
                Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
              },
            }
          )
          .then(() => {
            console.log("Successfully deleted contact from CRM");
            res.status(204).send();
          })
          .catch(error => {
            console.error("Failed to delete contact from CRM:", error.response.data);
            res.status(500).json({ success: false, message: error.message });
          });
          break;
  
        case "DATABASE":
          pool.query("DELETE FROM contacts WHERE id = ?", [contact_id], (error, result) => {
            if (error) {
              console.error("Failed to delete contact from Database:", error.message);
              return res.status(500).json({ success: false, message: error.message });
            }
  
            if (result.affectedRows === 0) {
              console.log("Contact not found in Database with id:", contact_id);
              return res.status(404).json({ message: "Contact not found" });
            }
  
            console.log("Successfully deleted contact from Database");
            res.status(204).send();
          });
          break;
  
        default:
          console.log("Invalid data_store value provided:", data_store);
          res.status(400).json({ success: false, message: "Invalid data_store value" });
          break;
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  

module.exports = {
  createContact,
  getContact,
  updateContact,
  deleteContact,
};

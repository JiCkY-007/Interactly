const axios = require('axios');
const ContactModel = require('../models/contactModel');

// Create Contact in Database or CRM
exports.createContact = async (req, res) => {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;

    try {
        if (data_store === 'DATABASE') {
            // Logic to create contact in the database
            const contactId = await ContactModel.create({ first_name, last_name, email, mobile_number });
            res.json({ success: true, data: { id: contactId, first_name, last_name, email, mobile_number } });
        } else if (data_store === 'CRM') {
            // CRM logic to create contact in FreshSales
            const crmResponse = await axios.post(
                'https://abhigyan.myfreshworks.com/crm/sales/api/contacts',
                {
                    first_name,
                    last_name,
                    email,
                    mobile_number
                },
                {
                    headers: {
                        'Authorization': `Token token=${process.env.FRESHSALES_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Assuming the response contains the created contact's ID and other details
            const crmContact = crmResponse.data;
            res.json({ success: true, data: crmContact });
        } else {
            res.status(400).json({ success: false, message: "Invalid data_store value" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

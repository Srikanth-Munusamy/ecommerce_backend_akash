const Address = require('../models/Address'); // Adjust path as necessary

// Create or Update an Address for a User
exports.createOrUpdateAddress = async (req, res) => {
  try {
const { userId } = req.user.userId;
    
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

    // Check if the user already has an address
    let address = await Address.findOne({ where: {userId } });

    if (address) {
      // If address exists, update it
      await address.update({
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      });
      res.status(200).json({ message: 'Address updated successfully', address });
    } else {
      // If no address exists, create a new one
      address = await Address.create({
        userId,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      });
      res.status(201).json({ message: 'Address created successfully', address });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get the address for a specific user
exports.getAddressByUserId = async (req, res) => {
  try {
    const { userId } = req.user.userId;
    
    // Find the address associated with the userId
    const address = await Address.findOne({ where: { userId } });

    if (address) {
      res.status(200).json(address);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete an address by userId
exports.deleteAddressByUserId = async (req, res) => {
  try {
    const { userId } = req.user.userId;
    
    // Find the address associated with the userId
    const address = await Address.findOne({ where: { userId } });

    if (address) {
      // If the address exists, delete it
      await address.destroy();
      res.status(200).json({ message: 'Address deleted successfully' });
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




// Admin: Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll();
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching addresses' });
  }
};

// Get the address for a specific user by admin
exports.admingetAddressByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find the address associated with the userId
    const address = await Address.findOne({ where: { userId } });

    if (address) {
      res.status(200).json(address);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete an address by userId
exports.admindeleteAddressByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find the address associated with the userId
    const address = await Address.findOne({ where: { userId } });

    if (address) {
      // If the address exists, delete it
      await address.destroy();
      res.status(200).json({ message: 'Address deleted successfully' });
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const Address = require('../models/Address'); // Adjust path as necessary

// Create a new address
exports.createAddress = async (req, res) => {
  try {
    const { userId, addressLine1, addressLine2, city, state, postalCode, country } = req.body;
    const address = await Address.create({
      userId,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    });
    res.status(201).json(address);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all addresses for a specific user
exports.getAddressesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.findAll({ where: { userId } });
    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get a specific address by ID
exports.getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findByPk(addressId);
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

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;
    const address = await Address.findByPk(addressId);
    if (address) {
      await address.update({
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      });
      res.status(200).json(address);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findByPk(addressId);
    if (address) {
      await address.destroy();
      res.status(204).json(); // No content
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

// Admin: Delete an address
exports.deleteAddressByAdmin = async (req, res) => {
  const { addressId } = req.params;

  try {
    const address = await Address.findByPk(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    await address.destroy();
    res.status(200).json({ message: 'Address deleted successfully by admin' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting address by admin' });
  }
};
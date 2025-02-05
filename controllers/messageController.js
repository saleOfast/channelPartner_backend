const admin = require('../firebase/config.js');



exports.sendNotification = async(req, res)=>{
 try {
    const { ID } = req.body;

    // Check if ID is valid
    if (!ID) {
      return res.status(400).json({ message: 'ID is required' });
    }

    // Construct the notification message
   const message = {
  data: {
    text: 'Hello, world!',
    click_action: 'FLUTTER_NOTIFICATION_CLICK',
    sound: 'default',
  },
    token: ID,
};

    // Send the notification
    const response = await admin.messaging().send(message);

    // Log the response
    console.log('Successfully sent message:', response);

    // Return success response
    return res.status(200).json({ message: 'Notification delivered' });
  } catch (error) {
    logErrorToFile(error)
    console.error('Error sending message:', error);
    // Return error response
    return res.status(500).json({ message: 'Failed to deliver notification' });
  }
}
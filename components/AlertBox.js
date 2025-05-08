import { useEffect } from 'react';
import { BackHandler, Text } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

const AlertBox = ({ show, type, message, onClose }) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true // disables back button when alert is showing
    );

    return () => backHandler.remove(); // use remove(), not removeEventListener
  }, [show]);

  const getAlertDetails = () => {
    switch (type) {
      case 'success':
        return { title: 'Success!', color: '#4CAF50' };
      case 'warning':
        return { title: 'Warning!', color: '#FFC107' };
      case 'error':
        return { title: 'Error!', color: '#F44336' };
      case 'info':
        return { title: 'Info', color: '#2196F3' };
      default:
        return { title: '', color: '' };
    }
  };

  const alertDetails = getAlertDetails();

  return (
    // <AwesomeAlert
    //   show={show}
    //   showProgress={false}
    //   title={alertDetails.title}
    //   message={message}
    //   closeOnTouchOutside={true}
    //   closeOnHardwareBackPress={false}
    //   showConfirmButton={true}
    //   confirmText="OK!"
    //   confirmButtonColor={alertDetails.color}
    //   onConfirmPressed={onClose}
    // />
    <Text style={{ color: alertDetails.color }}>
      {alertDetails.title}: {message}
    </Text>

  );
};

export default AlertBox;

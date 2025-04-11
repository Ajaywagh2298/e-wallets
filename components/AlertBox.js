import React from 'react';
import AwesomeAlert from 'react-native-awesome-alerts';

const AlertBox = ({ show, type, message, onClose }) => {
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
    <AwesomeAlert
      show={show}
      showProgress={false}
      title={alertDetails.title}
      message={message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText="OK!"
      confirmButtonColor={alertDetails.color}
      onConfirmPressed={onClose}
    />
  );
};

export default AlertBox;

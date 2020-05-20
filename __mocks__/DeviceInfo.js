const DeviceInfo = jest.genMockFromModule('react-native-device-info');

DeviceInfo.hasNotch = ()=> false;

export default DeviceInfo;
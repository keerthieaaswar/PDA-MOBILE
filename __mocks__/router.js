const router = jest.genMockFromModule('react-native-router-flux');

router.Actions.replace = ()=>jest.fn();

export default router;
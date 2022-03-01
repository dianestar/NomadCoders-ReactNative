import { StyleSheet } from 'react-native';
import { theme } from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100
  },

  insertInput: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    fontSize: 15
  },

  toDoView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.toDoBackground,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10
  },

  toDoText: {
    color: "white",
    fontSize: 15  
  }, 

  editInput: {
    flex: 0.9,
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 15
  },
});

export default styles;
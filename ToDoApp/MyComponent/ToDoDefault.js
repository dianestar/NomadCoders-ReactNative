import { View, TouchableOpacity, Text, Alert, TouchableHighlightComponent } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../MyStyle/colors';
import styles from '../MyStyle/styles';

export default function ToDo( { id, toDos, setToDos, saveToDos, editModeSwitch } ) {
    const deleteToDo = (id) => {
        Alert.alert(
          "Delete " + toDos[id].toDo, 
          "Are you sure?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                const newToDos = {...toDos};
                delete newToDos[id];
                setToDos(newToDos);
                saveToDos(newToDos);        
              }
            }
          ]
        );
    };
    
    const changeStatus = (id) => {
      const newToDos = {...toDos};
      if (newToDos[id].done === true) { newToDos[id].done = false; }
      else if (newToDos[id].done === false) { newToDos[id].done = true; }
      setToDos(newToDos);
      saveToDos(newToDos);
    };

    return (
        <View key={id} style={styles.toDoView}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity onPress={() => changeStatus(id)}>
            {toDos[id].done ? 
              <MaterialIcons name="check-box" size={24} color={theme.inactivated} style={{marginRight: 10}} />
              : 
              <MaterialIcons name="check-box-outline-blank" size={24} color={theme.point} style={{marginRight: 10}} />
            }
          </TouchableOpacity>
          <Text style={{...styles.toDoText,
            color: toDos[id].done ? theme.inactivated : theme.point,
            textDecorationLine: toDos[id].done ? "line-through" : null
            }}
          >
            {toDos[id].toDo}
          </Text>
        </View>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity onPress={() => editModeSwitch(id)}>
            <Feather name="edit" size={24} color={theme.inactivated} style={{marginRight: 10}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteToDo(id)}>
            <Feather name="delete" size={24} color={theme.inactivated} />
          </TouchableOpacity>
        </View>
      </View>
    );
}
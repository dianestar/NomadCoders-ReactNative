import { useEffect, useState } from 'react';
import { View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from '../MyStyle/styles';

export default function ToDoEdit( { id, toDos, setToDos, saveToDos, editModeSwitch } ) {
    const [edited, setEdited] = useState("");
    
    useEffect(() => {
      setEdited(toDos[id].toDo);
    }, []);

    const onChangeText = (payload) => setEdited(payload);

    const editToDo = () => {
      const newToDos = {...toDos};
      toDos[id].toDo = edited;
      setToDos(newToDos);
      saveToDos(newToDos);

      editModeSwitch(id);
    };

    return (
        <View style={styles.toDoView}>
        <TextInput
          style={styles.editInput}
          autoFocus
          returnKeyType="done"
          placeholder={toDos[id].toDo}
          value={edited}
          onChangeText={onChangeText}
          blurOnSubmit
        />
        <TouchableOpacity onPress={editToDo}>
          <Ionicons name="checkmark-done" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    );
}
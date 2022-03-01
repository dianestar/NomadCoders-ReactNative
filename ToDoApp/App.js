import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, TextInput, ScrollView, Alert, TouchableHighlightComponent } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToDoDefault from './MyComponent/ToDoDefault';
import ToDoEdit from './MyComponent/ToDoEdit';
import { theme } from './MyStyle/colors';
import styles from './MyStyle/styles';

const STORAGE_KEY = "@toDOs";
const CATEGORY_KEY = "@category";

export default function App() {
  const [isStudy, setIsStudy] = useState(true);
  const [toDo, setToDo] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
  }, []);

  const health = async () => {
    setIsStudy(false);
    await AsyncStorage.setItem(CATEGORY_KEY, "health");
  };

  const study = async () => {
    setIsStudy(true);
    await AsyncStorage.setItem(CATEGORY_KEY, "study");
  };
    
  const onChangeText = (payload) => setToDo(payload);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    try {
      const category = await AsyncStorage.getItem(CATEGORY_KEY);
      if (category == "study") { setIsStudy(true); }
      else { setIsStudy(false); }

      const str = await AsyncStorage.getItem(STORAGE_KEY);
      if (str != null) {
        setToDos(JSON.parse(str));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const addToDo = async () => {
    if (toDo === "") { return; }
    /*
    const newToDos = Object.assign(
      {},
      toDos, 
      {[Date.now()]: { toDo, isStudy }}
    )
    */

    const newToDos = {
      ...toDos,
      [Date.now()]: { toDo, isStudy, done: false, editMode: false }
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setToDo("");
  };

  const editModeSwitch = (id) => {
    const newToDos = {...toDos};
    if (newToDos[id].editMode === true) { newToDos[id].editMode = false; }
    else if (newToDos[id].editMode === false) { newToDos[id].editMode = true; }
    setToDos(newToDos);
    saveToDos(newToDos);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={study}>
          <Text style={{...styles.btnText, color: isStudy ? "white" : theme.inactivated}}>Study</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={health}>
          <Text style={{...styles.btnText, color: !isStudy? "white" : theme.inactivated}}>Health</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.insertInput}
          placeholder={isStudy ? "Add a To Do for Study Category" : "Add a To Do for Health Category"}
          returnKeyType="done"
          value={toDo}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}/>
        <ScrollView>
          {Object.keys(toDos).map(id =>
            toDos[id].isStudy === isStudy ?
            (toDos[id].editMode === false ?
              <ToDoDefault key={id} id={id} toDos={toDos} setToDos={setToDos} saveToDos={saveToDos} editModeSwitch={editModeSwitch} />              
            :
              <ToDoEdit key={id} id={id} toDos={toDos} setToDos={setToDos} saveToDos={saveToDos} editModeSwitch={editModeSwitch} />
            )
            :
            null
          )}
        </ScrollView>
      </View>
    </View>
  );
}
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, TouchableHighlightComponent } from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons'; 

const STORAGE_KEY = "@toDOs";

export default function App() {
  const [isStudy, setIsStudy] = useState(true);
  const [toDo, setToDo] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
  }, []);

  const health = () => setIsStudy(false);
  const study = () => setIsStudy(true);
    
  const onChangeText = (payload) => setToDo(payload);

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    try {
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
      [Date.now()]: { toDo, isStudy }
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setToDo("");
  };

  const deleteToDo = async (key) => {
    Alert.alert(
      "Delete" + toDos[key].toDo, 
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
            delete newToDos[key];
            setToDos(newToDos);
            saveToDos(newToDos);        
          }
        }
      ]
    );
  }

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
          style={styles.input}
          placeholder={isStudy ? "Add a To Do for Study Category" : "Add a To Do for Health Category"}
          returnKeyType="done"
          value={toDo}
          onChangeText={onChangeText}
          onSubmitEditing={addToDo}/>
        <ScrollView>
          {Object.keys(toDos).map(key =>
            toDos[key].isStudy === isStudy ?
              <View key={key} style={styles.toDoView}>
                <Text style={styles.toDoText}>{toDos[key].toDo}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Feather name="delete" size={24} color={theme.inactivated} />
                </TouchableOpacity>
              </View>
              :
              null
          )}
        </ScrollView>
      </View>
    </View>
  );
}

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

  btnText: {
    fontSize: 40,
    fontWeight: "bold"
  },

  input: {
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
  }
});
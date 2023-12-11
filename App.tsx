// App.tsx
// App.tsx
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableHighlight,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import {BSON} from 'realm';
import {RealmContext, Task} from './models/Task';

const {useQuery, useRealm} = RealmContext;

function App(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);

  useEffect(() => {
    const subscription = tasks.subscribe();
    // return () => {
    //   subscription.unsubscribe();
    // };
  }, [tasks]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const addTask = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new BSON.ObjectId(),
        title: newTaskTitle,
        description: newTaskDescription,
      });
    });
    setNewTaskTitle(''); // Clear input after adding
    setNewTaskDescription('');
  }, [realm, newTaskTitle, newTaskDescription]);

  const updateTask = useCallback(
    (taskId: BSON.ObjectId, newTitle: string) => {
      realm.write(() => {
        const taskToUpdate = realm.objectForPrimaryKey('Task', taskId);
        if (taskToUpdate) {
          taskToUpdate.title = newTitle;
        }
      });
    },
    [realm],
  );

  const deleteTask = useCallback(
    (taskId: BSON.ObjectId) => {
      realm.write(() => {
        const taskToDelete = realm.objectForPrimaryKey('Task', taskId);
        if (taskToDelete) {
          realm.delete(taskToDelete);
        }
      });
    },
    [realm],
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={newTaskTitle}
          onChangeText={text => setNewTaskTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={newTaskDescription}
          onChangeText={text => setNewTaskDescription(text)}
        />
        <TouchableHighlight
          style={styles.addButton}
          onPress={addTask}
          underlayColor="#FF1493">
          <Text style={{color: 'white'}}>{'Add New Task'}</Text>
        </TouchableHighlight>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => String(item._id)}
        renderItem={({item}) => (
          <View style={styles.listItem}>
            <Text>{`${item.title} - ${item.description}`}</Text>
            <TextInput
              style={styles.updateInput}
              placeholder="Enter new title"
              onChangeText={text => updateTask(item._id, text)}
            />
            <TouchableHighlight
              style={styles.deleteButton}
              onPress={() => deleteTask(item._id)}>
              <Text style={{color: 'white'}}>{'Delete Task'}</Text>
            </TouchableHighlight>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    padding: 5,
  },
  listItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#FF69B4',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  updateInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
});

export default App;

// import React, {useCallback, useEffect} from 'react';
// import {RealmContext, Task} from './models/Task';
// import {
//   FlatList,
//   Text,
//   TouchableHighlight,
//   View,
//   TextInput,
//   StyleSheet,
// } from 'react-native';
// import {BSON} from 'realm';

// const {useQuery, useRealm} = RealmContext;

// function App(): JSX.Element {
//   const realm = useRealm();
//   const tasks = useQuery(Task);

//   useEffect(() => {
//     const subscription = tasks.subscribe();
//   }, [tasks]);

//   const addTask = useCallback(() => {
//     realm.write(() => {
//       realm.create('Task', {
//         _id: new BSON.ObjectId(),
//         title: 'Sample Realm Title',
//         description: 'Sample Realm Testing Description',
//       });
//     });
//   }, [realm]);

//   const updateTask = useCallback(
//     (taskId: BSON.ObjectId, newTitle: string) => {
//       realm.write(() => {
//         const taskToUpdate = realm.objectForPrimaryKey('Task', taskId);
//         if (taskToUpdate) {
//           taskToUpdate.title = newTitle;
//         }
//       });
//     },
//     [realm],
//   );

//   const deleteTask = useCallback(
//     (taskId: BSON.ObjectId) => {
//       realm.write(() => {
//         const taskToDelete = realm.objectForPrimaryKey('Task', taskId);
//         if (taskToDelete) {
//           realm.delete(taskToDelete);
//         }
//       });
//     },
//     [realm],
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={tasks}
//         keyExtractor={item => String(item._id)}
//         renderItem={({item}) => (
//           <View style={styles.listItem}>
//             <Text>{`${item.title} - ${item.description}`}</Text>
//             <TextInput
//               style={styles.updateInput}
//               placeholder="Enter new title"
//               onChangeText={text => updateTask(item._id, text)}
//             />
//             <TouchableHighlight
//               style={styles.deleteButton}
//               onPress={() => deleteTask(item._id)}>
//               <Text style={{color: 'white'}}>{'Delete Task'}</Text>
//             </TouchableHighlight>
//           </View>
//         )}
//       />
//       <TouchableHighlight
//         style={styles.addButton}
//         onPress={addTask}
//         underlayColor="#FF1493">
//         <Text style={{color: 'white'}}>{'Add New Task'}</Text>
//       </TouchableHighlight>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#F5FCFF',
//   },
//   listItem: {
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: '#D3D3D3',
//     borderRadius: 5,
//   },
//   addButton: {
//     backgroundColor: '#FF69B4',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   deleteButton: {
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   updateInput: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 5,
//     padding: 5,
//     marginTop: 5,
//   },
// });

// export default App;

// import React, {useCallback, useEffect} from 'react';
// import {RealmContext, Task} from './models/Task';
// import {FlatList, Text, TouchableHighlight, View} from 'react-native';
// import {BSON} from 'realm';

// const {useQuery, useRealm} = RealmContext;

// function App(): JSX.Element {
//   const realm = useRealm();
//   const tasks = useQuery(Task);

//   useEffect(() => {
//     realm.subscriptions.update(mutableSubs => {
//       mutableSubs.add(realm.objects(Task));
//     });
//   }, [realm]);

//   const addTask = useCallback(() => {
//     realm.write(() => {
//       realm.create('Task', {
//         _id: new BSON.ObjectId(),
//         title: 'Sample Realm Title',
//         description: 'Sample Realm Testing Description',
//       });
//     });
//   }, []);

//   return (
//     <View style={{flex: 1}}>
//       <FlatList
//         data={tasks}
//         renderItem={({item}) => (
//           <Text>{`${item.title} - ${item.description}`}</Text>
//         )}
//       />
//       <TouchableHighlight style={{backgroundColor: 'pink'}} onPress={addTask}>
//         <Text>{'Add New Task'}</Text>
//       </TouchableHighlight>
//     </View>
//   );
// }

// export default App;

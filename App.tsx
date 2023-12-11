import React, {useCallback, useEffect} from 'react';
import {RealmContext, Task} from './models/Task';
import {FlatList, Text, TouchableHighlight, View} from 'react-native';
import {BSON} from 'realm';

const {useQuery, useRealm} = RealmContext;

function App(): JSX.Element {
  const realm = useRealm();
  const tasks = useQuery(Task);

  useEffect(() => {
    realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(realm.objects(Task));
    });
  }, [realm]);

  const addTask = useCallback(() => {
    realm.write(() => {
      realm.create('Task', {
        _id: new BSON.ObjectId(),
        title: 'Sample Realm Title',
        description: 'Sample Realm Description',
      });
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={tasks}
        renderItem={({item}) => (
          <Text>{`${item.title} - ${item.description}`}</Text>
        )}
      />
      <TouchableHighlight style={{backgroundColor: 'pink'}} onPress={addTask}>
        <Text>{'Add New Task'}</Text>
      </TouchableHighlight>
    </View>
  );
}

export default App;

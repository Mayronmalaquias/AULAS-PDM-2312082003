import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image, TextInput } from 'react-native';
import {titulo} from './utils'
import qualquercoisa from './utils'
import { btn_cadastro_meta, rotulo_input_meta, rotulo_lista_meta } from './mensagens';
import MetaInput from './components/MetaInput';
import MetaList from './components/MetaList';

export default function App() {

  const [meta,setMeta] = useState([]);



  function adicionarMetaHandler(){
    setMetas([...metas,inputMetaText])
  }

  return (
    <View style={styles.mainContainer}>
      <MetaInput onAddMeta={adicionarMetaHandler} />

      <View style={styles.metaContainer}>
        <MetaList array={metas} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    padding: 30,
  },
  metaContainer: {
    flex:1
  }
});

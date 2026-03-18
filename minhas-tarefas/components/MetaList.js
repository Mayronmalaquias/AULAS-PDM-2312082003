import { ScrollView } from "react-native";

function MetaList(props){
  <ScrollView style={styles.metaContainer}>
    {meta.map((meta,index)=><Text key={index}
    style={StyleSheet.item}>{meta}</Text>)}
  </ScrollView>
};

export default MetaList;

const styles = StyleSheet.create( {
  item: {
    margin:8,
    borderRadius:5,
    padding: 10,
    backgroundColor: 'lightblue',
  }
})
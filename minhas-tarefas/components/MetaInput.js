function MetaInput(props){
    const [inputMetaText, setInputMetaText] = useState('');
    function metaInputHandLer(inputText){
        setInputMetaText(inputText)
    };
    return(
        <View styles={{flexDirection:'row',
                        justifyContent:'space-between',
                        flex:1}}>
            <View styles={{width:'65%'}}>
            <TextInput style={styles.inputText}
            placeholder={rotulo_input_meta}
            onChanceText={metaInputHandLer} />
            </View>
            <View>
            <Button title={btn_cadastro_meta} 
            onPress={adicionarMetaHandler} />
            </View>
        </View> 
    );
}

export default MetaInput;
const styles = StyleSheet.create({

  inputText: {
    borderColor:'#cccccc',
    borderWidth:1
  },
  
});
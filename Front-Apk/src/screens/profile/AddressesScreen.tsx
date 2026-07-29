import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Endereco {
    id: string;
    rotulo: string; // Ex: 'Casa', 'Trabalho'
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    principal: boolean;
}

export function AddressesScreen({ navigation }: any) {
    const [enderecos, setEnderecos] = useState<Endereco[]>([
        {
            id: '1',
            rotulo: 'Casa',
            cep: '01001-000',
            logradouro: 'Praça da Sé',
            numero: '100',
            complemento: 'Apto 42',
            bairro: 'Sé',
            cidade: 'São Paulo',
            uf: 'SP',
            principal: true,
        },
    ]);

    const [modalVisivel, setModalVisivel] = useState(false);
    const [buscandoCep, setBuscandoCep] = useState(false);

    // Campos do formulário de endereço
    const [rotulo, setRotulo] = useState('Casa');
    const [cep, setCep] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');

    // Função de busca automática via API ViaCEP
    const buscarEnderecoPorCep = async (cepInput: string) => {
        const cepLimpo = cepInput.replace(/\D/g, '');
        setCep(cepInput);

        if (cepLimpo.length === 8) {
            setBuscandoCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                const data = await response.json();

                if (data.erro) {
                    Alert.alert('CEP Não Encontrado', 'Verifique o número digitado e tente novamente.');
                } else {
                    setLogradouro(data.logradouro || '');
                    setBairro(data.bairro || '');
                    setCidade(data.localidade || '');
                    setUf(data.uf || '');
                }
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível buscar o CEP automaticamente.');
            } finally {
                setBuscandoCep(false);
            }
        }
    };

    const handleSalvarEndereco = () => {
        if (!cep || !logradouro || !numero || !cidade || !uf) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios (CEP, Número, Logradouro, Cidade e UF).');
            return;
        }

        const novoEndereco: Endereco = {
            id: String(Date.now()),
            rotulo: rotulo || 'Outro',
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            principal: enderecos.length === 0,
        };

        setEnderecos([...enderecos, novoEndereco]);
        limparFormulario();
        setModalVisivel(false);
        Alert.alert('Sucesso', 'Endereço cadastrado com sucesso!');
    };

    const limparFormulario = () => {
        setRotulo('Casa');
        setCep('');
        setLogradouro('');
        setNumero('');
        setComplemento('');
        setBairro('');
        setCidade('');
        setUf('');
    };

    const handleRemoverEndereco = (id: string) => {
        Alert.alert('Remover Endereço', 'Tem certeza que deseja excluir este endereço?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: () => setEnderecos(enderecos.filter((item) => item.id !== id)),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Text style={styles.textoVoltar}>←</Text>
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>MEUS ENDEREÇOS</Text>
                <View style={styles.espacadorHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Lista de Endereços Salvos */}
                {enderecos.map((item) => (
                    <View key={item.id} style={styles.cardEndereco}>
                        <View style={styles.headerCard}>
                            <View style={styles.badgeRotulo}>
                                <Ionicons name="location" size={12} color="#00F0FF" />
                                <Text style={styles.textoRotulo}>{item.rotulo.toUpperCase()}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoverEndereco(item.id)}>
                                <Ionicons name="trash-outline" size={16} color="#666677" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.textoLogradouro}>
                            {item.logradouro}, {item.numero} {item.complemento ? `- ${item.complemento}` : ''}
                        </Text>
                        <Text style={styles.textoDetalhes}>
                            {item.bairro} - {item.cidade}/{item.uf}
                        </Text>

                        <Text style={styles.textoCep}>CEP: {item.cep}</Text>
                    </View>
                ))}

                {/* Botão para Abrir Formulário de Novo Endereço */}
                {!modalVisivel ? (
                    <TouchableOpacity
                        style={styles.btnAdicionar}
                        onPress={() => setModalVisivel(true)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={18} color="#000" />
                        <Text style={styles.textoBtnAdicionar}>ADICIONAR NOVO ENDEREÇO</Text>
                    </TouchableOpacity>
                ) : (
                    /* Form de Cadastro de Endereço */
                    <View style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Text style={styles.formTitulo}>NOVO ENDEREÇO</Text>
                            <TouchableOpacity onPress={() => setModalVisivel(false)}>
                                <Ionicons name="close" size={20} color="#666677" />
                            </TouchableOpacity>
                        </View>

                        {/* Rótulo */}
                        <Text style={styles.label}>RÓTULO (EX: CASA, TRABALHO)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Casa"
                            placeholderTextColor="#444455"
                            value={rotulo}
                            onChangeText={setRotulo}
                        />

                        {/* Input do CEP com indicador de busca */}
                        <Text style={styles.label}>CEP (BUSCA AUTOMÁTICA) *</Text>
                        <View style={styles.inputCepContainer}>
                            <TextInput
                                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                                placeholder="00000-000"
                                placeholderTextColor="#444455"
                                keyboardType="numeric"
                                maxLength={9}
                                value={cep}
                                onChangeText={buscarEnderecoPorCep}
                            />
                            {buscandoCep && (
                                <ActivityIndicator style={styles.loaderCep} size="small" color="#00F0FF" />
                            )}
                        </View>

                        {/* Logradouro e Número */}
                        <Text style={styles.label}>LOGRADOURO / RUA *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Rua / Avenida"
                            placeholderTextColor="#444455"
                            value={logradouro}
                            onChangeText={setLogradouro}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.label}>NÚMERO *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="123"
                                    placeholderTextColor="#444455"
                                    keyboardType="numeric"
                                    value={numero}
                                    onChangeText={setNumero}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.label}>COMPLEMENTO</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Apto 101"
                                    placeholderTextColor="#444455"
                                    value={complemento}
                                    onChangeText={setComplemento}
                                />
                            </View>
                        </View>

                        {/* Bairro, Cidade e Estado */}
                        <Text style={styles.label}>BAIRRO</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Bairro"
                            placeholderTextColor="#444455"
                            value={bairro}
                            onChangeText={setBairro}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 2, marginRight: 8 }}>
                                <Text style={styles.label}>CIDADE *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="São Paulo"
                                    placeholderTextColor="#444455"
                                    value={cidade}
                                    onChangeText={setCidade}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.label}>UF *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="SP"
                                    placeholderTextColor="#444455"
                                    maxLength={2}
                                    autoCapitalize="characters"
                                    value={uf}
                                    onChangeText={setUf}
                                />
                            </View>
                        </View>

                        {/* Botões de Ação */}
                        <TouchableOpacity
                            style={styles.btnSalvar}
                            onPress={handleSalvarEndereco}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.textoBtnSalvar}>SALVAR ENDEREÇO</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050508' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    btnVoltar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0F0F16',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoVoltar: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    tituloHeader: { color: '#888899', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    espacadorHeader: { width: 40 },

    scroll: { padding: 20 },

    cardEndereco: {
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    badgeRotulo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    textoRotulo: { color: '#00F0FF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    textoLogradouro: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 2 },
    textoDetalhes: { color: '#888899', fontSize: 12, marginBottom: 6 },
    textoCep: { color: '#555566', fontSize: 10, fontWeight: '800' },

    btnAdicionar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00F0FF',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 10,
        gap: 6,
    },
    textoBtnAdicionar: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

    formContainer: {
        backgroundColor: '#0F0F16',
        borderRadius: 20,
        padding: 16,
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(0, 240, 255, 0.2)',
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    formTitulo: { color: '#00F0FF', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },

    label: { color: '#666677', fontSize: 9, fontWeight: '900', letterSpacing: 1, marginBottom: 6 },
    input: {
        backgroundColor: '#050508',
        color: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 13,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginBottom: 14,
    },
    inputCepContainer: {
        position: 'relative',
        justifyContent: 'center',
        marginBottom: 14,
    },
    loaderCep: {
        position: 'absolute',
        right: 14,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    btnSalvar: {
        backgroundColor: '#00F0FF',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    textoBtnSalvar: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
});
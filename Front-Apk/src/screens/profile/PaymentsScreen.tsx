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
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CartaoCredito {
    id: string;
    titular: string;
    numeroMascarado: string; // Ex: **** **** **** 4321
    validade: string;
    bandeira: 'visa' | 'mastercard' | 'elo';
    principal: boolean;
}

export function PaymentsScreen({ navigation }: any) {
    const [cartoes, setCartoes] = useState<CartaoCredito[]>([
        {
            id: '1',
            titular: 'SNEAKERHEAD VIP',
            numeroMascarado: '•••• •••• •••• 8842',
            validade: '12/28',
            bandeira: 'mastercard',
            principal: true,
        },
    ]);

    const [modalVisivel, setModalVisivel] = useState(false);

    // Campos do formulário
    const [numeroCartao, setNumeroCartao] = useState('');
    const [nomeTitular, setNomeTitular] = useState('');
    const [validade, setValidade] = useState('');
    const [cvv, setCvv] = useState('');
    const [bandeira, setBandeira] = useState<'visa' | 'mastercard' | 'elo'>('visa');

    // Máscara simplificada para o número do cartão
    const handleNumeroCartao = (text: string) => {
        const limpo = text.replace(/\D/g, '').slice(0, 16);
        const formatado = limpo.replace(/(\d{4})/g, '$1 ').trim();
        setNumeroCartao(formatado);
    };

    // Máscara simplificada para a validade (MM/AA)
    const handleValidade = (text: string) => {
        const limpo = text.replace(/\D/g, '').slice(0, 4);
        if (limpo.length >= 3) {
            setValidade(`${limpo.slice(0, 2)}/${limpo.slice(2)}`);
        } else {
            setValidade(limpo);
        }
    };

    const handleSalvarCartao = () => {
        if (!numeroCartao || numeroCartao.length < 19 || !nomeTitular || !validade || !cvv) {
            Alert.alert('Campos Incompletos', 'Preencha todos os dados do cartão corretamente.');
            return;
        }

        const ultimosDigitos = numeroCartao.replace(/\s/g, '').slice(-4);

        const novoCartao: CartaoCredito = {
            id: String(Date.now()),
            titular: nomeTitular.toUpperCase(),
            numeroMascarado: `•••• •••• •••• ${ultimosDigitos}`,
            validade,
            bandeira,
            principal: cartoes.length === 0,
        };

        setCartoes([...cartoes, novoCartao]);
        limparFormulario();
        setModalVisivel(false);
        Alert.alert('Sucesso', 'Cartão adicionado com sucesso!');
    };

    const limparFormulario = () => {
        setNumeroCartao('');
        setNomeTitular('');
        setValidade('');
        setCvv('');
        setBandeira('visa');
    };

    const handleRemoverCartao = (id: string) => {
        Alert.alert('Excluir Cartão', 'Deseja remover este método de pagamento?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: () => setCartoes(cartoes.filter((item) => item.id !== id)),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>FORMAS DE PAGAMENTO</Text>
                <View style={styles.espacadorHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Opção Rápida PIX */}
                <View style={styles.cardPix}>
                    <View style={styles.headerPix}>
                        <View style={styles.badgePix}>
                            <Ionicons name="flash-outline" size={14} color="#00E676" />
                            <Text style={styles.textoBadgePix}>PIX INSTANTÂNEO</Text>
                        </View>
                        <Text style={styles.descontoPix}>5% OFF</Text>
                    </View>
                    <Text style={styles.subPix}>
                        Aprovação imediata para seus Drops exclusivos do Cyber-Kicks.
                    </Text>
                </View>

                {/* Seção Cartões de Crédito */}
                <Text style={styles.secaoTitulo}>CARTÕES DE CRÉDITO SALVOS</Text>

                {cartoes.map((item) => (
                    <View key={item.id} style={styles.cardCartao}>
                        <View style={styles.headerCartao}>
                            <View style={styles.rowBandeira}>
                                <Ionicons name="card" size={18} color="#00F0FF" />
                                <Text style={styles.textoBandeira}>{item.bandeira.toUpperCase()}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleRemoverCartao(item.id)}>
                                <Ionicons name="trash-outline" size={16} color="#666677" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.numeroCartao}>{item.numeroMascarado}</Text>

                        <View style={styles.footerCartao}>
                            <View>
                                <Text style={styles.labelCartao}>TITULAR</Text>
                                <Text style={styles.valorCartao}>{item.titular}</Text>
                            </View>
                            <View>
                                <Text style={styles.labelCartao}>VALIDADE</Text>
                                <Text style={styles.valorCartao}>{item.validade}</Text>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Botão Adicionar Cartão */}
                {!modalVisivel ? (
                    <TouchableOpacity
                        style={styles.btnAdicionar}
                        onPress={() => setModalVisivel(true)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={18} color="#000" />
                        <Text style={styles.textoBtnAdicionar}>ADICIONAR NOVO CARTÃO</Text>
                    </TouchableOpacity>
                ) : (
                    /* Form para Novo Cartão */
                    <View style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Text style={styles.formTitulo}>NOVO CARTÃO DE CRÉDITO</Text>
                            <TouchableOpacity onPress={() => setModalVisivel(false)}>
                                <Ionicons name="close" size={20} color="#666677" />
                            </TouchableOpacity>
                        </View>

                        {/* Seletor de Bandeira */}
                        <Text style={styles.label}>BANDEIRA DO CARTÃO</Text>
                        <View style={styles.seletorBandeira}>
                            {(['visa', 'mastercard', 'elo'] as const).map((b) => (
                                <TouchableOpacity
                                    key={b}
                                    style={[
                                        styles.opcaoBandeira,
                                        bandeira === b && styles.opcaoBandeiraAtiva,
                                    ]}
                                    onPress={() => setBandeira(b)}
                                >
                                    <Text
                                        style={[
                                            styles.textoBandeiraOpcao,
                                            bandeira === b && styles.textoBandeiraOpcaoAtiva,
                                        ]}
                                    >
                                        {b.toUpperCase()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Número do Cartão */}
                        <Text style={styles.label}>NÚMERO DO CARTÃO *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0000 0000 0000 0000"
                            placeholderTextColor="#444455"
                            keyboardType="numeric"
                            maxLength={19}
                            value={numeroCartao}
                            onChangeText={handleNumeroCartao}
                        />

                        {/* Nome do Titular */}
                        <Text style={styles.label}>NOME DO TITULAR (COMO NO CARTÃO) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="NOME SOBRENOME"
                            placeholderTextColor="#444455"
                            autoCapitalize="characters"
                            value={nomeTitular}
                            onChangeText={setNomeTitular}
                        />

                        {/* Validade e CVV */}
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.label}>VALIDADE (MM/AA) *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="12/28"
                                    placeholderTextColor="#444455"
                                    keyboardType="numeric"
                                    maxLength={5}
                                    value={validade}
                                    onChangeText={handleValidade}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.label}>CVV *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="123"
                                    placeholderTextColor="#444455"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    maxLength={4}
                                    value={cvv}
                                    onChangeText={setCvv}
                                />
                            </View>
                        </View>

                        {/* Botão Salvar */}
                        <TouchableOpacity
                            style={styles.btnSalvar}
                            onPress={handleSalvarCartao}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.textoBtnSalvar}>SALVAR CARTÃO</Text>
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
    tituloHeader: { color: '#888899', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    espacadorHeader: { width: 40 },

    scroll: { padding: 20 },

    cardPix: {
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 230, 118, 0.3)',
    },
    headerPix: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badgePix: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 230, 118, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    textoBadgePix: { color: '#00E676', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    descontoPix: { color: '#00E676', fontSize: 12, fontWeight: '900' },
    subPix: { color: '#888899', fontSize: 11, marginTop: 8 },

    secaoTitulo: { color: '#666677', fontSize: 9, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12 },

    cardCartao: {
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    headerCartao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    rowBandeira: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    textoBandeira: { color: '#00F0FF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

    numeroCartao: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 2, marginBottom: 16 },

    footerCartao: { flexDirection: 'row', justifyContent: 'space-between' },
    labelCartao: { color: '#555566', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    valorCartao: { color: '#CCCCCC', fontSize: 11, fontWeight: '700', marginTop: 2 },

    btnAdicionar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00F0FF',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 6,
        gap: 6,
    },
    textoBtnAdicionar: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

    formContainer: {
        backgroundColor: '#0F0F16',
        borderRadius: 20,
        padding: 16,
        marginTop: 6,
        borderWidth: 1,
        borderColor: 'rgba(0, 240, 255, 0.2)',
    },
    formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
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

    seletorBandeira: { flexDirection: 'row', gap: 8, marginBottom: 14 },
    opcaoBandeira: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#050508',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    opcaoBandeiraAtiva: {
        borderColor: '#00F0FF',
        backgroundColor: 'rgba(0, 240, 255, 0.1)',
    },
    textoBandeiraOpcao: { color: '#666677', fontSize: 10, fontWeight: '900' },
    textoBandeiraOpcaoAtiva: { color: '#00F0FF' },

    row: { flexDirection: 'row', justifyContent: 'space-between' },

    btnSalvar: {
        backgroundColor: '#00F0FF',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    textoBtnSalvar: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
});
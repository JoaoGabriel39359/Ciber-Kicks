import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    Image,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { useCart, ItemCarrinho } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext'; // 1. IMPORTANTE: Importamos o AuthContext

export function CartScreen({ navigation }: any) {
    const { itens, removerItem, atualizarQuantidade, valorTotal, limparCarrinho } = useCart();
    const { signed } = useAuth(); // 2. IMPORTANTE: Pegamos se o usuário está autenticado

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const obterFonteImagem = (imagem: any) => {
        if (!imagem) return { uri: 'https://via.placeholder.com/300' };
        if (Array.isArray(imagem)) {
            const url = String(imagem[0] || '').replace(/^http:\/\//, 'https://');
            return { uri: url };
        }
        if (typeof imagem === 'string') {
            return { uri: imagem.replace(/^http:\/\//, 'https://') };
        }
        return imagem;
    };

    // 3. Função responsável por decidir para onde mandar o usuário
    const handleFinalizarPedido = () => {
        if (!signed) {
            Alert.alert(
                'Autenticação Necessária',
                'Faça login ou crie uma conta para finalizar o seu pedido.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Fazer Login',
                        onPress: () => navigation.navigate('LoginScreen')
                    }
                ]
            );
            return;
        }

        // Se estiver logado, prossegue com a compra
        Alert.alert('Sucesso!', 'Pedido finalizado com sucesso!');
        limparCarrinho();
        navigation.navigate('HomeTab');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            {/* Header bar */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Text style={styles.textoVoltar}>←</Text>
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>CARRINHO</Text>
                <View style={styles.espacadorHeader} />
            </View>

            {itens.length === 0 ? (
                <View style={styles.containerVazio}>
                    <View style={styles.iconeVazioContainer}>
                        <Text style={styles.iconeVazio}>🛒</Text>
                    </View>
                    <Text style={styles.tituloVazio}>SEU CARRINHO ESTÁ VAZIO</Text>
                    <Text style={styles.subtituloVazio}>
                        Explore a nossa coleção exclusiva e escolha os melhores drops para o seu estilo.
                    </Text>
                    <TouchableOpacity
                        style={styles.btnVoltarHome}
                        onPress={() => navigation.navigate('HomeTab')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoBtnVoltar}>EXPLORAR DROPS →</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList<ItemCarrinho>
                        data={itens}
                        keyExtractor={(item, index) => `${item.produto.id}-${item.tamanho}-${index}`}
                        contentContainerStyle={styles.listaItens}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }: { item: ItemCarrinho }) => (
                            <View style={styles.cardItem}>
                                <View style={styles.containerImagem}>
                                    <Image
                                        source={obterFonteImagem(item.produto.imagem)}
                                        style={styles.imagemProduto}
                                        resizeMode="contain"
                                    />
                                </View>

                                <View style={styles.infoContainer}>
                                    <View style={styles.headerInfo}>
                                        <Text style={styles.marcaText}>
                                            {(item.produto as any).marca ? String((item.produto as any).marca).toUpperCase() : 'SNKRS'}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => removerItem(item.produto.id, item.tamanho)}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Text style={styles.btnRemover}>✕</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.nomeProduto} numberOfLines={1}>{item.produto.nome}</Text>

                                    <View style={styles.badgeTamanho}>
                                        <Text style={styles.textoTamanho}>TAMANHO: {item.tamanho}</Text>
                                    </View>

                                    <View style={styles.footerItem}>
                                        <Text style={styles.precoItem}>
                                            R$ {Number(item.produto.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </Text>

                                        <View style={styles.seletorQtd}>
                                            <TouchableOpacity
                                                style={styles.btnQtd}
                                                onPress={() => atualizarQuantidade(item.produto.id, item.tamanho, item.quantidade - 1)}
                                            >
                                                <Text style={styles.textoBtnQtd}>-</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.qtdNumero}>{item.quantidade}</Text>
                                            <TouchableOpacity
                                                style={styles.btnQtd}
                                                onPress={() => atualizarQuantidade(item.produto.id, item.tamanho, item.quantidade + 1)}
                                            >
                                                <Text style={styles.textoBtnQtd}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    />

                    {/* Summary footer card */}
                    <View style={styles.resumoContainer}>
                        <View style={styles.linhaResumo}>
                            <Text style={styles.labelResumo}>SUBTOTAL</Text>
                            <Text style={styles.valorResumo}>
                                R$ {Number(valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Text>
                        </View>

                        <View style={styles.linhaResumo}>
                            <Text style={styles.labelResumo}>ENVIO EXPRESSO</Text>
                            <Text style={styles.valorFrete}>GRÁTIS</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.linhaTotal}>
                            <Text style={styles.labelTotal}>TOTAL</Text>
                            <Text style={styles.valorTotal}>
                                R$ {Number(valorTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.btnCheckout}
                            activeOpacity={0.85}
                            onPress={handleFinalizarPedido}
                        >
                            <Text style={styles.textoBtnCheckout}>FINALIZAR PEDIDO →</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
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
    btnVoltar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0F0F16', justifyContent: 'center', alignItems: 'center' },
    textoVoltar: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    tituloHeader: { color: '#888899', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    espacadorHeader: { width: 40 },

    containerVazio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconeVazioContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#0F0F16',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    iconeVazio: { fontSize: 36 },
    tituloVazio: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
    subtituloVazio: { color: '#666677', fontSize: 12, textAlign: 'center', lineHeight: 18, marginBottom: 24 },
    btnVoltarHome: {
        backgroundColor: '#00F0FF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
    },
    textoBtnVoltar: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

    listaItens: { padding: 16, paddingBottom: 220 },
    cardItem: {
        flexDirection: 'row',
        backgroundColor: '#0F0F16',
        borderRadius: 20,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    containerImagem: {
        width: 100,
        height: 100,
        backgroundColor: '#050508',
        borderRadius: 14,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagemProduto: { width: '100%', height: '100%' },
    infoContainer: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
    headerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    marcaText: { color: '#00F0FF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    btnRemover: { color: '#666677', fontSize: 14, fontWeight: 'bold' },
    nomeProduto: { color: '#E0E0E0', fontSize: 13, fontWeight: '700', marginTop: 2 },
    badgeTamanho: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginVertical: 4,
    },
    textoTamanho: { color: '#888899', fontSize: 9, fontWeight: '800' },
    footerItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    precoItem: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
    seletorQtd: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#050508',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    btnQtd: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
    textoBtnQtd: { color: '#00F0FF', fontSize: 14, fontWeight: '900' },
    qtdNumero: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', paddingHorizontal: 8 },

    resumoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0F0F16',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        borderTopWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    labelResumo: { color: '#666677', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    valorResumo: { color: '#E0E0E0', fontSize: 12, fontWeight: '800' },
    valorFrete: { color: '#00F0FF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
    divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginVertical: 10 },
    linhaTotal: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    labelTotal: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
    valorTotal: { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
    btnCheckout: {
        backgroundColor: '#00F0FF',
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
    },
    textoBtnCheckout: { color: '#000000', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
});
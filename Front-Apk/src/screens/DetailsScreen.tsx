import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
    StatusBar,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Produto } from '../@types/produto';

const { width } = Dimensions.get('window');
const TAMANHOS = [38, 39, 40, 41, 42, 43];

export function DetailsScreen({ route, navigation }: any) {
    // Receives product and optional list from route params
    const { produto, produtos = [] } = route.params || {};
    const { adicionarAoCarrinho } = useCart();
    const { toggleFavorito, isFavorito } = useFavorites();

    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<number>(40);
    const [imagemAtivaIndex, setImagemAtivaIndex] = useState<number>(0);
    const [adicionado, setAdicionado] = useState<boolean>(false);

    // Shipping calculation states
    const [cep, setCep] = useState<string>('');
    const [calculandoFrete, setCalculandoFrete] = useState<boolean>(false);
    const [resultadoFrete, setResultadoFrete] = useState<{ valor: string; prazo: string } | null>(null);

    const favoritado = produto ? isFavorito(produto.id) : false;

    // Filter database products (excluding current product from recommendations)
    const produtosRecomendados = Array.isArray(produtos)
        ? produtos.filter((p: Produto) => String(p.id) !== String(produto?.id))
        : [];

    // Current product image mapping
    const extrairListaImagens = (itemProduto: any): string[] => {
        if (!itemProduto?.imagem) return ['https://via.placeholder.com/600'];

        if (Array.isArray(itemProduto.imagem)) {
            return itemProduto.imagem.map((img: string) => String(img).replace(/^http:\/\//, 'https://'));
        }

        if (typeof itemProduto.imagem === 'string') {
            const urlBase = String(itemProduto.imagem).replace(/^http:\/\//, 'https://');
            return [urlBase];
        }

        return ['https://via.placeholder.com/600'];
    };

    const listaImagens = extrairListaImagens(produto);

    const handleAdicionar = () => {
        if (produto) {
            adicionarAoCarrinho(produto, tamanhoSelecionado);
            setAdicionado(true);
            setTimeout(() => setAdicionado(false), 2000);
        }
    };

    // Shipping simulation handler
    const handleCalcularFrete = () => {
        if (cep.replace(/\D/g, '').length < 8) return;

        setCalculandoFrete(true);
        setResultadoFrete(null);

        setTimeout(() => {
            setCalculandoFrete(false);
            setResultadoFrete({
                valor: 'R$ 19,90',
                prazo: '3 a 5 dias úteis (Express SNKRS)'
            });
        }, 800);
    };

    if (!produto) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Text style={styles.textoVoltar}>←</Text>
                </TouchableOpacity>

                {/* Favorite button */}
                <TouchableOpacity
                    style={styles.btnFavorito}
                    activeOpacity={0.7}
                    onPress={() => toggleFavorito(produto)}
                >
                    <Ionicons
                        name={favoritado ? 'heart' : 'heart-outline'}
                        size={20}
                        color={favoritado ? '#00F0FF' : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* IMAGE CAROUSEL */}
                <View style={styles.carrosselWrapper}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={(e) => {
                            const slide = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
                            if (slide !== imagemAtivaIndex && slide < listaImagens.length) {
                                setImagemAtivaIndex(slide);
                            }
                        }}
                        scrollEventThrottle={16}
                    >
                        {listaImagens.map((imgUrl, index) => (
                            <View key={index} style={styles.slideFrame}>
                                <View style={styles.glowBg} />
                                <Image
                                    source={{ uri: imgUrl }}
                                    style={styles.imagemProduto}
                                    resizeMode="contain"
                                />
                            </View>
                        ))}
                    </ScrollView>

                    {/* Carousel Indicators */}
                    {listaImagens.length > 1 && (
                        <View style={styles.paginacaoContainer}>
                            {listaImagens.map((_, idx) => (
                                <View
                                    key={idx}
                                    style={[
                                        styles.dotPaginacao,
                                        idx === imagemAtivaIndex && styles.dotPaginacaoAtivo
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Product Details */}
                <View style={styles.infoWrapper}>
                    <Text style={styles.tagMarca}>
                        {(produto as any).marca ? String((produto as any).marca).toUpperCase() : 'SNKRS LAB'}
                    </Text>
                    <Text style={styles.nome}>{produto.nome}</Text>
                    <Text style={styles.preco}>
                        R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>

                    <Text style={styles.descricao}>
                        Construção anatômica com suporte lateral para estabilidade máxima. Edição limitada com acabamento acetinado de alta resistência.
                    </Text>

                    {/* Size Selection */}
                    <Text style={styles.labelTamanho}>SELECIONE O TAMANHO (BR)</Text>
                    <View style={styles.tamanhosGrid}>
                        {TAMANHOS.map((tam) => {
                            const ativo = tamanhoSelecionado === tam;
                            return (
                                <TouchableOpacity
                                    key={tam}
                                    style={[styles.boxTamanho, ativo && styles.boxTamanhoAtivo]}
                                    onPress={() => setTamanhoSelecionado(tam)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.textoTamanho, ativo && styles.textoTamanhoAtivo]}>
                                        {tam}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Shipping calculation */}
                    <View style={styles.secaoDivider} />
                    <Text style={styles.secaoTitulo}>CALCULAR FRETE E PRAZO</Text>

                    <View style={styles.freteInputContainer}>
                        <TextInput
                            style={styles.inputCep}
                            placeholder="Digite seu CEP (Ex: 01001-000)"
                            placeholderTextColor="#555566"
                            keyboardType="numeric"
                            maxLength={9}
                            value={cep}
                            onChangeText={(t) => setCep(t)}
                        />
                        <TouchableOpacity
                            style={styles.btnCalcularFrete}
                            onPress={handleCalcularFrete}
                            activeOpacity={0.8}
                        >
                            {calculandoFrete ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <Text style={styles.textoBtnFrete}>CALCULAR</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {resultadoFrete && (
                        <View style={styles.resultadoFreteBox}>
                            <Ionicons name="sparkles" size={18} color="#00F0FF" />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={styles.textoFretePrazo}>{resultadoFrete.prazo}</Text>
                                <Text style={styles.textoFreteValor}>{resultadoFrete.valor}</Text>
                            </View>
                        </View>
                    )}

                    {/* Reviews section */}
                    <View style={styles.secaoDivider} />
                    <View style={styles.headerAvaliacoes}>
                        <View>
                            <Text style={styles.secaoTitulo}>AVALIAÇÕES DOS CLIENTES</Text>
                            <View style={styles.ratingStarsRow}>
                                <Text style={styles.ratingNumber}>4.9</Text>
                                <Ionicons name="star" size={14} color="#00F0FF" />
                                <Ionicons name="star" size={14} color="#00F0FF" />
                                <Ionicons name="star" size={14} color="#00F0FF" />
                                <Ionicons name="star" size={14} color="#00F0FF" />
                                <Ionicons name="star" size={14} color="#00F0FF" />
                                <Text style={styles.ratingCount}>(48 opiniões)</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardReview}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewAutor}>Lucas M. // São Paulo</Text>
                            <View style={{ flexDirection: 'row', gap: 2 }}>
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons key={i} name="star" size={10} color="#00F0FF" />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.reviewTexto}>
                            "Qualidade insana! Chegou em 2 dias aqui em SP. O acabamento é impecável e fica extremamente confortável no pé."
                        </Text>
                    </View>

                    <View style={styles.cardReview}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewAutor}>Gabriel S. // Curitiba</Text>
                            <View style={{ flexDirection: 'row', gap: 2 }}>
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons key={i} name="star" size={10} color="#00F0FF" />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.reviewTexto}>
                            "Design surreal de lindo, atrai olhares onde passa. A caixa e a embalagem vieram 100% protegidas."
                        </Text>
                    </View>

                    {/* Product recommendations */}
                    {produtosRecomendados.length > 0 && (
                        <>
                            <View style={styles.secaoDivider} />
                            <Text style={styles.secaoTitulo}>QUEM VIU, COMPROU TAMBÉM</Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.carrosselRecomendados}
                            >
                                {produtosRecomendados.map((item: Produto) => {
                                    const imgUrl = extrairListaImagens(item)[0];
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={styles.cardRecomendado}
                                            activeOpacity={0.8}
                                            onPress={() => navigation.push('Details', { produto: item, produtos })}
                                        >
                                            <Image source={{ uri: imgUrl }} style={styles.imgRecomendado} resizeMode="contain" />
                                            <Text style={styles.marcaRecomendado}>
                                                {(item as any).marca ? String((item as any).marca).toUpperCase() : 'SNKRS'}
                                            </Text>
                                            <Text style={styles.nomeRecomendado} numberOfLines={1}>{item.nome}</Text>
                                            <Text style={styles.precoRecomendado}>
                                                R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </>
                    )}

                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.btnComprar, adicionado && styles.btnAdicionado]}
                    onPress={handleAdicionar}
                    activeOpacity={0.8}
                >
                    <Text style={styles.textoBtnComprar}>
                        {adicionado ? '✓ ADICIONADO AO CARRINHO' : 'ADICIONAR AO CARRINHO'}
                    </Text>
                </TouchableOpacity>
            </View>
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
    btnFavorito: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0F0F16',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },

    scroll: { paddingBottom: 120 },
    carrosselWrapper: { height: 260, position: 'relative' },
    slideFrame: {
        width: width,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    glowBg: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(0, 240, 255, 0.08)',
    },
    imagemProduto: { width: '85%', height: '85%' },

    paginacaoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        gap: 6,
    },
    dotPaginacao: { width: 8, height: 4, borderRadius: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
    dotPaginacaoAtivo: { width: 20, backgroundColor: '#00F0FF' },

    infoWrapper: { paddingHorizontal: 20, paddingTop: 16 },
    tagMarca: { color: '#00F0FF', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 4 },
    nome: { color: '#FFFFFF', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
    preco: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 6 },
    descricao: { color: '#888899', fontSize: 13, lineHeight: 20, marginTop: 12 },

    labelTamanho: { color: '#666677', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginTop: 24, marginBottom: 12 },
    tamanhosGrid: { flexDirection: 'row', gap: 10 },
    boxTamanho: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        backgroundColor: '#0F0F16',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    boxTamanhoAtivo: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
    textoTamanho: { color: '#888899', fontSize: 14, fontWeight: '800' },
    textoTamanhoAtivo: { color: '#000000', fontWeight: '900' },

    // Shipping
    secaoDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.06)', marginVertical: 24 },
    secaoTitulo: { color: '#666677', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12 },
    freteInputContainer: { flexDirection: 'row', gap: 10 },
    inputCep: {
        flex: 1,
        height: 48,
        backgroundColor: '#0F0F16',
        borderRadius: 14,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 13,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    btnCalcularFrete: {
        paddingHorizontal: 20,
        backgroundColor: '#00F0FF',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBtnFrete: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
    resultadoFreteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 240, 255, 0.06)',
        padding: 12,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 240, 255, 0.2)',
    },
    textoFretePrazo: { color: '#E0E0E0', fontSize: 12, fontWeight: '700' },
    textoFreteValor: { color: '#00F0FF', fontSize: 12, fontWeight: '900', marginTop: 2 },

    // Reviews
    headerAvaliacoes: { marginBottom: 12 },
    ratingStarsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    ratingNumber: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginRight: 4 },
    ratingCount: { color: '#888899', fontSize: 11, marginLeft: 6 },
    cardReview: {
        backgroundColor: '#0F0F16',
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    reviewAutor: { color: '#00F0FF', fontSize: 11, fontWeight: '800' },
    reviewTexto: { color: '#A0A0B0', fontSize: 12, lineHeight: 18 },

    // Recommendations
    carrosselRecomendados: { gap: 12, paddingRight: 20 },
    cardRecomendado: {
        width: 140,
        backgroundColor: '#0F0F16',
        padding: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    imgRecomendado: { width: '100%', height: 90, marginBottom: 6 },
    marcaRecomendado: { color: '#00F0FF', fontSize: 8, fontWeight: '900' },
    nomeRecomendado: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', marginTop: 2 },
    precoRecomendado: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', marginTop: 4 },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0D0D14',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.08)',
    },
    btnComprar: { height: 56, backgroundColor: '#00F0FF', borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    btnAdicionado: { backgroundColor: '#10B981' },
    textoBtnComprar: { color: '#000000', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
});
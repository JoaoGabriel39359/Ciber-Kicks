import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
    Dimensions,
    StatusBar,
    ImageBackground
} from 'react-native';

import { Produto } from '../@types/produto';
import { obterProdutos } from '../services/api';
import { CardProduto } from '../components/CardProduto';
import { useCart } from '../contexts/CartContext';

const MARCAS = ['Todas', 'Nike', 'Jordan', 'Adidas', 'Gucci', 'Balenciaga', 'Louis Vuitton'];
const BANNER_BLACK_CAT_IA = 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&q=80';

export function HomeScreen({ navigation }: any) {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
    const [marcaSelecionada, setMarcaSelecionada] = useState<string>('Todas');
    const [carregando, setCarregando] = useState<boolean>(true);
    const { totalItens } = useCart();

    // Real-time animated scroll
    const scrollY = useRef(new Animated.Value(0)).current;

    const buscarProdutos = async () => {
        try {
            setCarregando(true);
            const dados = await obterProdutos();
            setProdutos(dados);
            setProdutosFiltrados(dados);
        } catch (erro) {
            console.error('Error loading products:', erro);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarProdutos();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: '#050508', elevation: 0, shadowOpacity: 0 },
            headerTintColor: '#FFFFFF',
            headerRight: () => (
                <TouchableOpacity
                    style={styles.botaoHeader}
                    onPress={() => navigation.navigate('Cart')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.textoIcone}>🛒</Text>
                    {totalItens > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.textoBadge}>{totalItens}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            ),
        });
    }, [navigation, totalItens]);

    const selecionarMarca = (marca: string) => {
        setMarcaSelecionada(marca);
        if (marca === 'Todas') {
            setProdutosFiltrados(produtos);
        } else {
            const filtrados = produtos.filter(item =>
                item.nome?.toLowerCase().includes(marca.toLowerCase()) ||
                (item as any).marca?.toLowerCase() === marca.toLowerCase()
            );
            setProdutosFiltrados(filtrados);
        }
    };

    // Scroll-based animations
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 150, 320],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    const headerScale = scrollY.interpolate({
        inputRange: [-100, 0, 320],
        outputRange: [1.05, 1, 0.92],
        extrapolate: 'clamp',
    });

    const textTranslateY = scrollY.interpolate({
        inputRange: [0, 320],
        outputRange: [0, -25],
        extrapolate: 'clamp',
    });

    // Catalog fade-in and slide up animation on scroll
    const catalogOpacity = scrollY.interpolate({
        inputRange: [0, 180, 300],
        outputRange: [0.35, 0.8, 1],
        extrapolate: 'clamp',
    });

    const catalogTranslateY = scrollY.interpolate({
        inputRange: [0, 250],
        outputRange: [40, 0],
        extrapolate: 'clamp',
    });

    const renderHeroInterativo = () => {
        const produtoDestaque = produtos.find(p => p.nome?.toLowerCase().includes('jordan')) || produtos[0];

        return (
            <View style={styles.heroSection}>
                <Animated.View style={[styles.tickerBar, { opacity: headerOpacity }]}>
                    <View style={styles.tickerItem}>
                        <Text style={styles.tickerDot}>●</Text>
                        <Text style={styles.tickerText}>AUTÊNTICO</Text>
                    </View>
                    <View style={styles.tickerDivider} />
                    <View style={styles.tickerItem}>
                        <Text style={styles.tickerText}>ENVIO EXPRESSO</Text>
                    </View>
                    <View style={styles.tickerDivider} />
                    <View style={styles.tickerItem}>
                        <Text style={styles.tickerText}>ED. LIMITADA</Text>
                    </View>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.bannerContainer,
                        {
                            opacity: headerOpacity,
                            transform: [{ scale: headerScale }]
                        }
                    ]}
                >
                    <ImageBackground
                        source={{ uri: BANNER_BLACK_CAT_IA }}
                        style={styles.bannerImageBackground}
                        imageStyle={styles.bannerImageStyle}
                    >
                        <View style={styles.bannerOverlay}>
                            <Animated.View
                                style={[
                                    styles.bannerContent,
                                    { transform: [{ translateY: textTranslateY }] }
                                ]}
                            >
                                <View style={styles.tagNovidade}>
                                    <View style={styles.dotPulse} />
                                    <Text style={styles.textoTag}>SPECIAL DROP // 20% OFF</Text>
                                </View>

                                <Text style={styles.bannerTitle}>AIR JORDAN 4</Text>
                                <Text style={styles.bannerTitleSub}>BLACK CAT EDITION</Text>
                                <Text style={styles.bannerSubtitle}>
                                    O preto absoluto encontra a precisão estética do futuro.
                                </Text>

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    style={styles.btnExplore}
                                    onPress={() => {
                                        if (produtoDestaque) {
                                            navigation.navigate('Details', { produto: produtoDestaque, produtos });
                                        }
                                    }}
                                >
                                    <Text style={styles.textoBtnExplore}>COMPRAR EDIÇÃO →</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </ImageBackground>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.marcasWrapper,
                        {
                            opacity: headerOpacity,
                            transform: [{ scale: headerScale }]
                        }
                    ]}
                >
                    <Text style={styles.secaoTitulo}>LINHAS EXCLUSIVAS</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.marcasContainer}
                    >
                        {MARCAS.map((marca) => {
                            const ativa = marcaSelecionada === marca;
                            return (
                                <TouchableOpacity
                                    key={marca}
                                    style={[styles.chipMarca, ativa && styles.chipMarcaAtiva]}
                                    onPress={() => selecionarMarca(marca)}
                                    activeOpacity={0.7}
                                >
                                    {ativa && <View style={styles.chipDotActive} />}
                                    <Text style={[styles.textoChip, ativa && styles.textoChipAtivo]}>
                                        {marca}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Animated.View>

                <View style={styles.headerColecao}>
                    <Text style={styles.secaoTitulo}>
                        {marcaSelecionada === 'Todas' ? 'CATÁLOGO DISPONÍVEL' : `LINHA // ${marcaSelecionada.toUpperCase()}`}
                    </Text>
                    <Text style={styles.contadorProdutos}>{produtosFiltrados.length} MODELOS</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />
            {carregando ? (
                <View style={styles.centro}>
                    <ActivityIndicator size="large" color="#00F0FF" />
                    <Text style={styles.textoCarregando}>CARREGANDO COLEÇÃO CYBER...</Text>
                </View>
            ) : (
                <Animated.FlatList
                    data={produtosFiltrados}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.lista}
                    ListHeaderComponent={renderHeroInterativo}
                    onRefresh={buscarProdutos}
                    refreshing={carregando}

                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}

                    renderItem={({ item }) => (
                        <Animated.View
                            style={[
                                styles.cardWrapper,
                                {
                                    opacity: catalogOpacity,
                                    transform: [{ translateY: catalogTranslateY }]
                                }
                            ]}
                        >
                            <CardProduto
                                item={item}
                                onPress={() => navigation.navigate('Details', { produto: item, produtos })}
                            />
                        </Animated.View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050508' },
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    textoCarregando: { marginTop: 14, color: '#666677', fontWeight: '900', fontSize: 11, letterSpacing: 2 },
    heroSection: { marginBottom: 10, paddingTop: 4 },

    tickerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0F0F16',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.04)',
    },
    tickerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    tickerDot: { color: '#00F0FF', fontSize: 8 },
    tickerText: { color: '#888899', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    tickerDivider: { width: 1, height: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)' },

    bannerContainer: {
        height: 280,
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    bannerImageBackground: { flex: 1, justifyContent: 'flex-end' },
    bannerImageStyle: { borderRadius: 24 },
    bannerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(5, 5, 8, 0.65)',
        justifyContent: 'flex-end',
        padding: 22,
    },
    bannerContent: { zIndex: 2 },
    tagNovidade: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(0, 240, 255, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(0, 240, 255, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 8,
    },
    dotPulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00F0FF', marginRight: 6 },
    textoTag: { color: '#00F0FF', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
    bannerTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
    bannerTitleSub: { color: '#00F0FF', fontSize: 18, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
    bannerSubtitle: { color: '#A0A0B0', fontSize: 12, marginBottom: 14, maxWidth: '85%' },
    btnExplore: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    textoBtnExplore: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

    marcasWrapper: { marginBottom: 20 },
    headerColecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    contadorProdutos: { fontSize: 10, color: '#00F0FF', fontWeight: '900', letterSpacing: 1 },
    secaoTitulo: { fontSize: 11, fontWeight: '900', color: '#666677', letterSpacing: 1.5 },
    marcasContainer: { paddingVertical: 10 },
    chipMarca: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 25,
        backgroundColor: '#0F0F16',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    chipMarcaAtiva: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
    chipDotActive: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#000000', marginRight: 6 },
    textoChip: { fontSize: 12, fontWeight: '800', color: '#666677' },
    textoChipAtivo: { color: '#000000', fontWeight: '900' },
    lista: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 100 },
    row: { justifyContent: 'space-between' },
    cardWrapper: { width: '48%', marginBottom: 16 },
    botaoHeader: { padding: 6, position: 'relative', marginRight: 10 },
    textoIcone: { fontSize: 22 },
    badge: {
        position: 'absolute',
        right: -2,
        top: -2,
        backgroundColor: '#00F0FF',
        borderRadius: 9,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoBadge: { color: '#000000', fontSize: 10, fontWeight: '900' },
});
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obterProdutos } from '../services/api';
import { Produto } from '../@types/produto';

export function SearchScreen({ navigation }: any) {
    const [pesquisa, setPesquisa] = useState('');
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarProdutos();
    }, []);

    useEffect(() => {
        const termo = pesquisa.trim().toLowerCase();

        if (termo.length === 0) {
            setProdutosFiltrados([]);
        } else {
            const filtrados = todosProdutos.filter((item) => {
                const nomeMatch = item.nome?.toLowerCase().includes(termo);
                const marcaMatch = (item as any).marca?.toLowerCase().includes(termo);
                return nomeMatch || marcaMatch;
            });
            setProdutosFiltrados(filtrados);
        }
    }, [pesquisa, todosProdutos]);

    const carregarProdutos = async () => {
        try {
            setCarregando(true);
            const dados = await obterProdutos();
            setTodosProdutos(dados);
        } catch (error) {
            console.error('Erro ao carregar produtos na busca:', error);
        } finally {
            setCarregando(false);
        }
    };

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

    const renderItem = ({ item }: { item: Produto }) => {
        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate('Details', { produto: item, produtos: todosProdutos });
                }}
            >
                <View style={styles.cardImagemContainer}>
                    <Image
                        source={obterFonteImagem(item.imagem)}
                        style={styles.cardImagem}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.cardMarca}>
                        {(item as any).marca ? String((item as any).marca).toUpperCase() : 'SNKRS'}
                    </Text>
                    <Text style={styles.cardNome} numberOfLines={1}>
                        {item.nome}
                    </Text>
                    <Text style={styles.cardPreco}>
                        R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#666677" />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    {/* Header da Busca */}
                    <View style={styles.searchHeader}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="search" size={18} color="#00F0FF" style={styles.searchIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Buscar por modelo ou marca..."
                                placeholderTextColor="#444455"
                                value={pesquisa}
                                onChangeText={setPesquisa}
                                autoCapitalize="none"
                                returnKeyType="search"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                            {pesquisa.length > 0 && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setPesquisa('');
                                        Keyboard.dismiss();
                                    }}
                                >
                                    <Ionicons name="close-circle" size={18} color="#666677" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Conteúdo Principal */}
                    {carregando ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#00F0FF" />
                            <Text style={styles.textoCarregando}>BUSCANDO DROPS...</Text>
                        </View>
                    ) : pesquisa.trim() === '' ? (
                        /* Estado Inicial (Vazio) */
                        <View style={styles.centerContainer}>
                            <View style={styles.iconeContainer}>
                                <Ionicons name="search-outline" size={36} color="#00F0FF" />
                            </View>
                            <Text style={styles.emptyTitle}>ENCONTRE SEU SNEAKER</Text>
                            <Text style={styles.emptySubtitle}>
                                Digite a marca ou modelo exclusivo que você procura.
                            </Text>
                        </View>
                    ) : produtosFiltrados.length === 0 ? (
                        /* Estado Sem Resultados */
                        <View style={styles.centerContainer}>
                            <View style={styles.iconeContainer}>
                                <Ionicons name="sad-outline" size={36} color="#666677" />
                            </View>
                            <Text style={styles.emptyTitle}>NENHUM ITEM ENCONTRADO</Text>
                            <Text style={styles.emptySubtitle}>
                                Tente buscar por outros termos ou marcas.
                            </Text>
                        </View>
                    ) : (
                        /* Lista de Resultados */
                        <FlatList
                            data={produtosFiltrados}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContainer}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            onScrollBeginDrag={Keyboard.dismiss}
                        />
                    )}
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#050508',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#050508',
    },
    searchHeader: {
        backgroundColor: '#050508',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F16',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    textoCarregando: {
        marginTop: 14,
        color: '#666677',
        fontWeight: '900',
        fontSize: 10,
        letterSpacing: 2,
    },
    iconeContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#0F0F16',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    emptyTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1.5,
        marginBottom: 6,
    },
    emptySubtitle: {
        fontSize: 11,
        color: '#666677',
        textAlign: 'center',
        lineHeight: 16,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardImagemContainer: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: '#050508',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
    },
    cardImagem: {
        width: '100%',
        height: '100%',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    cardMarca: {
        fontSize: 9,
        fontWeight: '900',
        color: '#00F0FF',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    cardNome: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
        marginVertical: 2,
    },
    cardPreco: {
        fontSize: 14,
        fontWeight: '900',
        color: '#FFFFFF',
    },
});
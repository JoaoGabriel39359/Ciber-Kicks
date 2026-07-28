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
import { obterProdutos, Produto } from '../services/api';

export function SearchScreen({ navigation }: any) {
    const [pesquisa, setPesquisa] = useState('');
    const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarProdutos();
    }, []);

    // Filter products when search term is entered
    useEffect(() => {
        const termo = pesquisa.trim().toLowerCase();

        if (termo.length === 0) {
            setProdutosFiltrados([]);
        } else {
            const filtrados = todosProdutos.filter((item) => {
                const nomeMatch = item.nome?.toLowerCase().includes(termo);
                const marcaMatch = item.marca?.toLowerCase().includes(termo);
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
            console.error('Error loading products for search:', error);
        } finally {
            setCarregando(false);
        }
    };

    const formatarUrlImagem = (imagemData?: string | string[]) => {
        let url = '';

        if (Array.isArray(imagemData) && imagemData.length > 0) {
            url = imagemData[0];
        } else if (typeof imagemData === 'string') {
            url = imagemData;
        }

        if (!url) return 'https://via.placeholder.com/150';

        if (url.includes('localhost') || url.includes('127.0.0.1')) {
            return url.replace('localhost', '192.168.29.211').replace('127.0.0.1', '192.168.29.211');
        }

        if (url.startsWith('/')) {
            return `http://192.168.29.211:8000${url}`;
        }

        return url;
    };

    const renderItem = ({ item }: { item: Produto }) => {
        const urlImagem = formatarUrlImagem(item.imagem);

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => {
                    Keyboard.dismiss();
                    navigation.navigate('Details', { produto: item });
                }}
            >
                <Image source={{ uri: urlImagem }} style={styles.cardImagem} />
                <View style={styles.cardInfo}>
                    <Text style={styles.cardMarca}>{item.marca || 'Sneaker'}</Text>
                    <Text style={styles.cardNome} numberOfLines={1}>
                        {item.nome}
                    </Text>
                    <Text style={styles.cardPreco}>
                        R$ {Number(item.preco).toFixed(2).replace('.', ',')}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    {/* Search Header */}
                    <View style={styles.searchHeader}>
                        <View style={styles.inputContainer}>
                            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Buscar por nome ou marca..."
                                placeholderTextColor="#666"
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
                                    <Ionicons name="close-circle" size={18} color="#888" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Main Content */}
                    {carregando ? (
                        <View style={styles.centerContainer}>
                            <ActivityIndicator size="large" color="#00E676" />
                        </View>
                    ) : pesquisa.trim() === '' ? (
                        /* Empty state */
                        <View style={styles.centerContainer}>
                            <Ionicons name="search-outline" size={64} color="#333" />
                            <Text style={styles.emptyTitle}>Encontre o seu tênis</Text>
                            <Text style={styles.emptySubtitle}>
                                Digite a marca ou o modelo que você está procurando.
                            </Text>
                        </View>
                    ) : produtosFiltrados.length === 0 ? (
                        /* No results found state */
                        <View style={styles.centerContainer}>
                            <Ionicons name="sad-outline" size={50} color="#333" />
                            <Text style={styles.emptyTitle}>Nenhum tênis encontrado</Text>
                            <Text style={styles.emptySubtitle}>
                                Tente buscar por outros termos.
                            </Text>
                        </View>
                    ) : (
                        /* Search results list */
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
        backgroundColor: '#0D0D0D',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    searchHeader: {
        backgroundColor: '#0D0D0D',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 46,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#FFF',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
        marginTop: 6,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#161616',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#222',
    },
    cardImagem: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#222',
        resizeMode: 'contain',
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    cardMarca: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#888',
        textTransform: 'uppercase',
    },
    cardNome: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFF',
        marginVertical: 2,
    },
    cardPreco: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#00E676',
    },
});
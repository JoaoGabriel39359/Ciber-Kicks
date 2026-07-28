import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useFavorites } from '../contexts/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export function FavoritesScreen({ navigation }: any) {
    const { favoritos, toggleFavorito } = useFavorites();

    const obterFonteImagem = (imagem: any) => {
        if (!imagem) return { uri: 'https://via.placeholder.com/300' };
        if (Array.isArray(imagem)) return { uri: String(imagem[0]).replace(/^http:\/\//, 'https://') };
        return { uri: String(imagem).replace(/^http:\/\//, 'https://') };
    };

    if (favoritos.length === 0) {
        return (
            <SafeAreaView style={styles.containerVazio}>
                <StatusBar barStyle="light-content" backgroundColor="#050508" />
                <View style={styles.iconeVazioContainer}>
                    <Ionicons name="heart-outline" size={40} color="#00F0FF" />
                </View>
                <Text style={styles.tituloVazio}>NENHUM ITEM NOS FAVORITOS</Text>
                <Text style={styles.subtituloVazio}>
                    Que tal conferir os últimos drops e salvar seus sneakers favoritos?
                </Text>
                <TouchableOpacity
                    style={styles.btnExplorar}
                    onPress={() => navigation.navigate('HomeTab')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.textoBtnExplorar}>VER NOVIDADES →</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />
            <View style={styles.header}>
                <Text style={styles.tituloHeader}>MEUS FAVORITOS</Text>
            </View>

            <FlatList
                data={favoritos}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                contentContainerStyle={styles.lista}
                columnWrapperStyle={styles.colunaWrapper}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('Details', { produto: item })}
                    >
                        <TouchableOpacity style={styles.btnHeart} onPress={() => toggleFavorito(item)}>
                            <Ionicons name="heart" size={18} color="#00F0FF" />
                        </TouchableOpacity>

                        <Image source={obterFonteImagem(item.imagem)} style={styles.imagem} resizeMode="contain" />

                        <Text style={styles.marca}>{(item as any).marca ? String((item as any).marca).toUpperCase() : 'SNKRS'}</Text>
                        <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
                        <Text style={styles.preco}>
                            R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050508' },
    header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    tituloHeader: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
    lista: { padding: 16 },
    colunaWrapper: { justifyContent: 'space-between', marginBottom: 16 },
    card: {
        width: '48%',
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 12,
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    btnHeart: { position: 'absolute', top: 10, right: 10, zIndex: 10 },
    imagem: { width: '100%', height: 110, marginVertical: 8 },
    marca: { color: '#00F0FF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    nome: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', marginTop: 2 },
    preco: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', marginTop: 4 },

    containerVazio: { flex: 1, backgroundColor: '#050508', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    iconeVazioContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0F0F16', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    tituloVazio: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
    subtituloVazio: { color: '#666677', fontSize: 12, textAlign: 'center', lineHeight: 18, marginBottom: 24 },
    btnExplorar: { backgroundColor: '#00F0FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
    textoBtnExplorar: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
});
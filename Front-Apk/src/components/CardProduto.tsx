import React, { useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated, TouchableOpacity } from 'react-native';
import { Produto } from '../@types/produto';

interface CardProdutoProps {
    item: Produto;
    onPress: () => void;
}

export function CardProduto({ item, onPress }: CardProdutoProps) {
    const escalaToque = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(escalaToque, {
            toValue: 0.94,
            useNativeDriver: true,
            speed: 35,
            bounciness: 2,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(escalaToque, {
            toValue: 1,
            useNativeDriver: true,
            speed: 15,
            bounciness: 6,
        }).start();
    };

    const obterFonteImagem = () => {
        if (!item.imagem) return { uri: 'https://via.placeholder.com/300' };

        if (Array.isArray(item.imagem)) {
            const primeiraImagem = String(item.imagem[0] || '');
            const urlFormatada = primeiraImagem.replace(/^http:\/\//, 'https://');
            return { uri: urlFormatada };
        }

        if (typeof item.imagem === 'string') {
            const urlFormatada = String(item.imagem).replace(/^http:\/\//, 'https://');
            return { uri: urlFormatada };
        }

        return item.imagem;
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.touchable}
        >
            <Animated.View
                style={[
                    styles.card,
                    { transform: [{ scale: escalaToque }] }
                ]}
            >
                <View style={styles.containerImagem}>
                    <Image
                        source={obterFonteImagem()}
                        style={styles.imagemProduto}
                        fadeDuration={300}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.marcaText}>
                        {(item as any).marca ? String((item as any).marca).toUpperCase() : 'SNKRS'}
                    </Text>
                    <Text style={styles.nomeProduto} numberOfLines={2}>{item.nome}</Text>
                    <Text style={styles.precoProduto}>
                        R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: { width: '100%', marginBottom: 12 },
    card: { backgroundColor: 'transparent', width: '100%' },
    containerImagem: {
        width: '100%',
        height: 150,
        backgroundColor: '#0F0F16',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    imagemProduto: { width: '100%', height: '100%', resizeMode: 'contain' },
    infoContainer: { paddingTop: 10, paddingHorizontal: 2 },
    marcaText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#00F0FF',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 2,
    },
    nomeProduto: {
        fontSize: 13,
        color: '#E0E0E0',
        height: 36,
        lineHeight: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    precoProduto: { fontSize: 15, color: '#FFFFFF', fontWeight: '900' },
});
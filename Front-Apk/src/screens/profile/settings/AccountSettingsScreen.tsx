import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../contexts/AuthContext';

export function AccountSettingsScreen({ navigation }: any) {
    const { user, signOut } = useAuth();

    const handleExcluirConta = () => {
        Alert.alert('Excluir Conta', 'Esta ação é irreversível. Deseja realmente excluir sua conta?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    Alert.alert('Conta', 'Sua sessão foi encerrada.');
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>DADOS DA CONTA</Text>
                <View style={styles.espacadorHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.cardInfo}>
                    <Ionicons name="mail-outline" size={18} color="#00F0FF" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoLabel}>E-MAIL CADASTRADO</Text>
                        <Text style={styles.infoValor}>{user?.email || 'N/A'}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluirConta} activeOpacity={0.8}>
                    <Ionicons name="warning-outline" size={16} color="#FF3B30" />
                    <Text style={styles.textoBtnExcluir}>SOLICITAR EXCLUSÃO DA CONTA</Text>
                </TouchableOpacity>
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
    btnVoltar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0F0F16', justifyContent: 'center', alignItems: 'center' },
    tituloHeader: { color: '#888899', fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    espacadorHeader: { width: 40 },
    scroll: { padding: 20 },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        gap: 12,
        marginBottom: 20,
    },
    infoLabel: { color: '#555566', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    infoValor: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginTop: 2 },
    btnExcluir: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 59, 48, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.2)',
        gap: 8,
    },
    textoBtnExcluir: { color: '#FF3B30', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../services/supabase';

export function SecuritySettingsScreen({ navigation }: any) {
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleAlterarSenha = async () => {
        if (!novaSenha || !confirmarSenha) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não conferem.');
            return;
        }

        if (novaSenha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            setCarregando(true);
            const { error } = await supabase.auth.updateUser({ password: novaSenha });
            if (error) throw error;

            Alert.alert('Sucesso', 'Sua senha foi alterada com sucesso!');
            setNovaSenha('');
            setConfirmarSenha('');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Falha ao alterar senha.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.tituloHeader}>SEGURANÇA & SENHA</Text>
                <View style={styles.espacadorHeader} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.cardForm}>
                    <Text style={styles.label}>NOVA SENHA *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#444455"
                        secureTextEntry
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                    />

                    <Text style={styles.label}>CONFIRMAR NOVA SENHA *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor="#444455"
                        secureTextEntry
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                    />

                    <TouchableOpacity style={styles.btnSalvar} onPress={handleAlterarSenha} disabled={carregando}>
                        {carregando ? <ActivityIndicator color="#000" /> : <Text style={styles.textoBtnSalvar}>SALVAR NOVA SENHA</Text>}
                    </TouchableOpacity>
                </View>
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
    cardForm: {
        backgroundColor: '#0F0F16',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
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
    btnSalvar: { backgroundColor: '#00F0FF', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    textoBtnSalvar: { color: '#000000', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
});
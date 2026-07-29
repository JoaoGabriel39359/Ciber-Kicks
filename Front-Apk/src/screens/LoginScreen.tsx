import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export function LoginScreen({ navigation }: any) {
    const { signIn, signUp } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleAuth() {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Atenção', 'Preencha todos os campos.');
            return;
        }

        try {
            setLoading(true);
            if (isRegister) {
                await signUp(email, password);
                Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login.');
                setIsRegister(false);
            } else {
                await signIn(email, password);
                navigation.goBack(); // Volta para a tela anterior (Carrinho)
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Ocorreu um erro ao autenticar.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#050508" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">

                    {/* Botão Voltar */}
                    <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
                        <Text style={styles.textoVoltar}>←</Text>
                    </TouchableOpacity>

                    {/* Logo / Header */}
                    <View style={styles.header}>
                        <Text style={styles.logoText}>CYBER<Text style={{ color: '#00F0FF' }}>KICKS</Text></Text>
                        <Text style={styles.subtituloHeader}>
                            {isRegister ? 'CRIE SUA CONTA CYBER' : 'ENTRE NA SUA CONTA'}
                        </Text>
                    </View>

                    {/* Form Controls */}
                    <View style={styles.form}>
                        <Text style={styles.label}>E-MAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="seu@email.com"
                            placeholderTextColor="#444455"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>SENHA</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#444455"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={styles.btnSubmit}
                            onPress={handleAuth}
                            activeOpacity={0.8}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.btnSubmitText}>
                                    {isRegister ? 'CRIAR CONTA →' : 'ENTRAR →'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnToggle}
                            onPress={() => setIsRegister(!isRegister)}
                        >
                            <Text style={styles.textoToggle}>
                                {isRegister
                                    ? 'Já tem uma conta? Faça Login'
                                    : 'Ainda não tem conta? Cadastre-se'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#050508' },
    scrollContainer: { flexGrow: 1, padding: 24, justifyContent: 'center' },
    btnVoltar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#0F0F16',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
    },
    textoVoltar: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    header: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
    logoText: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: 3 },
    subtituloHeader: { color: '#666677', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginTop: 8 },
    form: { width: '100%' },
    label: { color: '#00F0FF', fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8, marginTop: 16 },
    input: {
        backgroundColor: '#0F0F16',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#FFFFFF',
        fontSize: 14,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    btnSubmit: {
        backgroundColor: '#00F0FF',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 28,
    },
    btnSubmitText: { color: '#000000', fontSize: 12, fontWeight: '900', letterSpacing: 1.5 },
    btnToggle: { marginTop: 20, alignItems: 'center', padding: 10 },
    textoToggle: { color: '#888899', fontSize: 12, fontWeight: '600' },
});
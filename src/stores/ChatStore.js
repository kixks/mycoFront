import { defineStore } from 'pinia'
import { ref, onUnmounted } from 'vue'
import { api } from '@/plugins/axios'
import * as signalR from '@microsoft/signalr'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const connection = ref(null)
  const user = ref(null)
  const selectedRecipient = ref(null)

  // Cleanup function to be called when component unmounts
  const cleanup = () => {
    if (connection.value) {
      connection.value.off('ReceiveMessage') // Remove all message handlers
      if (connection.value.state === 'Connected') {
        connection.value.stop() // Properly disconnect
      }
      connection.value = null
    }
    messages.value = []
  }

  // 🟢 Start SignalR connection and fetch messages
  const startConnection = async (localUserName, remoteUserName, onMessageReceived) => {
    // Cleanup any existing connection first
    cleanup()

    try {
      user.value = localUserName
      selectedRecipient.value = remoteUserName

      // Load combined message history between user and recipient
      const res = await api.get(`/Messages/conversation/${localUserName}/${remoteUserName}`)
      messages.value = (res.data || []).map((msg) => ({
        User: msg.user || msg.User, // Handle both cases
        Recipient: msg.recipient || msg.Recipient,
        Text: msg.text || msg.Text,
        ImageUrl: msg.imageUrl || msg.ImageUrl,
        Timestamp: new Date(msg.timestamp || msg.Timestamp).toISOString(),
      }))
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
    // Create new connection
    connection.value = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://kingfish-wealthy-calf.ngrok-free.app/chathub?user=${encodeURIComponent(localUserName)}`,
        {
          withCredentials: true,
        },
      )
      .withAutomaticReconnect()
      .build()

    // Single message handler
    connection.value.on('ReceiveMessage', (message) => {
      console.log('Received message:', message)

      // Check if message already exists to prevent duplicates
      const messageExists = messages.value.some(
        (m) =>
          m.User === message.user &&
          m.Recipient === message.recipient &&
          m.Text === message.text &&
          new Date(m.Timestamp).getTime() === new Date(message.timestamp).getTime(),
      )

      if (!messageExists) {
        const parsedMessage = {
          User: message.user,
          Recipient: message.recipient,
          Text: message.text,
          ImageUrl: message.imageUrl,
          Timestamp: new Date(message.timestamp).toISOString(),
        }
        messages.value.push(parsedMessage)
        if (onMessageReceived) onMessageReceived(parsedMessage)
      }
    })

    try {
      await connection.value.start()
      console.log('✅ SignalR Connected')
    } catch (error) {
      console.error('SignalR connection failed:', error)
    }
  }

  // 🟢 Send message with recipient
  const sendMessage = async (text) => {
    if (!connection.value || connection.value.state !== 'Connected') {
      console.warn('Connection not established.')
      return
    }

    if (!selectedRecipient.value) {
      console.warn('No recipient selected.')
      return
    }

    await connection.value.invoke('SendMessage', {
      sender: user.value || 'Anonymous',
      text,
      recipient: selectedRecipient.value,
      imageUrl: null,
    })
  }

  // 🟢 Send image with recipient
  const sendImage = async (imageUrl) => {
    if (!connection.value || connection.value.state !== 'Connected') {
      console.warn('Connection not established.')
      return
    }

    if (!selectedRecipient.value) {
      console.warn('No recipient selected.')
      return
    }

    await connection.value.invoke('SendMessage', {
      sender: user.value || 'Anonymous',
      text: '',
      recipient: selectedRecipient.value,
      imageUrl: imageUrl,
    })
  }

  // Make cleanup available to components
  return {
    user,
    messages,
    selectedRecipient,
    connection,
    startConnection,
    sendMessage,
    sendImage,
    cleanup,
  }
})

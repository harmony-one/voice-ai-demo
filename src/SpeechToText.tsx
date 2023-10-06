import React, {useEffect, useState} from 'react'
import {CheetahTranscript, Cheetah, CheetahModel} from '@picovoice/cheetah-web'
import { WebVoiceProcessor } from '@picovoice/web-voice-processor'

const accessKey = 'wKeLU3VQXdHPD5ekkQjwZfDWHWZxl9VSHi/mizxA2w4Tc1JM8EmsYg=='

const modelParams: CheetahModel = {
  publicPath: 'cheetah_params.pv',
  // or
  // base64: '',
  // Optionals
  customWritePath: "cheetah_model",
  forceWrite: false,
  version: 1,
}

export const SpeechToText = () => {
  const [isInitialized, setInitialized] = useState(false)
  const [transcriptions, setTranscriptions] = useState<string[]>([])

  const transcriptionCallback = (transcript: CheetahTranscript) => {
    // console.log('transcript', transcript)
    const text = transcript.transcript
    if(text) {
      console.log('Text: ', text)
      setTranscriptions(transcriptions => [...transcriptions, text])
    }
  }

  const processErrorCallback = (error: string) => {
    console.error('Error callback:', error)
  }

  useEffect(() => {
    const initCheetah = async () => {
      try {
        const cheetah = await Cheetah.create(
          accessKey,
          transcriptionCallback,
          modelParams,
          {
            enableAutomaticPunctuation: true,
            processErrorCallback
          }
        );
        await WebVoiceProcessor.subscribe(cheetah);
        setInitialized(true)
        console.log('Cheetah initialized')
      } catch (e) {
        console.error('Cannot init cheetah:', e)
      }
    }
    if(!isInitialized) {
      initCheetah()
    }
  }, [isInitialized]);

  return <div style={{ marginTop: '32px', marginLeft: '32px', textAlign: 'left' }}>
    <div style={{ fontSize: '20px' }}>
      {!isInitialized ? 'Wait for model initialization...' : 'Say something...'}
    </div>
    <div style={{ marginTop: '16px', fontSize: '32px', color: '#12486B' }}>
      {transcriptions[transcriptions.length - 1]}
    </div>
    <div style={{ marginTop: '16px', maxHeight: '200px' }}>
      {[...transcriptions]
        .reverse()
        .filter((_, index) => index > 0)
        .map(item => {
          return <div style={{ color: 'gray' }}>{item}</div>
        })
      }
    </div>
  </div>
}

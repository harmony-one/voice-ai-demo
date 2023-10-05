import React, {useEffect, useState} from 'react'
import {CheetahTranscript, Cheetah, CheetahModel} from '@picovoice/cheetah-web'
import { WebVoiceProcessor } from '@picovoice/web-voice-processor'

const accessKey = ''

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
  const [transcriptText, setTranscriptText] = useState('')

  const transcriptionCallback = (transcript: CheetahTranscript) => {
    // console.log('transcript', transcript)
    const text = transcript.transcript
    console.log('text', text)
    if(text) {
      setTranscriptText(text)
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
        console.log('Cheetah initialized')
      } catch (e) {
        console.error('Cannot init cheetah:', e)
      }
    }
    initCheetah()
  }, []);

  return <div style={{ marginTop: '32px' }}>
    <div style={{ fontSize: '20px' }}>Result: {transcriptText}</div>
  </div>
}

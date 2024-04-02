'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAudio, useWindowSize, useMount } from 'react-use'
import Confetti from 'react-confetti'

import { challengeOptions, challenges, userSubscription } from '@/db/schema'
import { upsertChallengeProgress } from '@/actions/challenge-progress'
import { reduceHearts } from '@/actions/user-progress'
import { useHeartsModal } from '@/store/use-hearts-modal'
import { usePracticeModal } from '@/store/use-practice-modal'

import Header from './Header'
import { ResultCard } from './ResultCard'
import { Footer } from './Footer'
import { QuestionBubble } from './QuestionBubble'
import { Challenge } from './Challenge'

type QuizProps = {
  initialPercentage: number
  initialHearts: number
  initialLessonId: number
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean
    challengeOptions: (typeof challengeOptions.$inferSelect)[]
  })[]
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean
      })
    | null
}

const Quiz = ({
  initialLessonId,
  initialPercentage,
  initialHearts,
  initialLessonChallenges,
  userSubscription
}: QuizProps) => {
  const { open: openHeartsModal } = useHeartsModal()

  const { open: openPracticeModal } = usePracticeModal()

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal()
    }
  })
  const { width, height } = useWindowSize()
  const router = useRouter()
  const [finishAudio] = useAudio({ src: '/finish.mp3', autoPlay: true })
  const [correctAudio, _c, correctControls] = useAudio({ src: '/correct.wav' })
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: '/incorrect.wav'
  })
  const [pending, startTransition] = useTransition()

  const [lessonId] = useState(initialLessonId)
  const [hearts, setHearts] = useState(initialHearts)
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage
  })

  const [challenges] = useState(initialLessonChallenges)
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      challenge => !challenge.completed
    )
    return uncompletedIndex === -1 ? 0 : uncompletedIndex
  })

  const [selectedOption, setSelectedOption] = useState<number>()
  const [status, setStatus] = useState<'correct' | 'wrong' | 'none'>('none')

  const currentChallenge = challenges[activeIndex]

  const options = currentChallenge?.challengeOptions ?? []

  const onNext = () => {
    setActiveIndex(current => current + 1)
  }

  const onSelect = (id: number) => {
    if (status !== 'none') return

    setSelectedOption(id)
  }

  const onContinue = () => {
    if (!selectedOption) return

    if (status === 'wrong') {
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    if (status === 'correct') {
      onNext()
      setStatus('none')
      setSelectedOption(undefined)
      return
    }

    const correctOption = options.find(option => option.correct)

    if (!correctOption) return

    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(currentChallenge.id)
          .then(response => {
            if (response?.error === 'hearts') {
              openHeartsModal()
              return
            }
            correctControls.play()
            setStatus('correct')
            setPercentage(prev => prev + 100 / challenges.length)

            if (initialPercentage === 100) {
              setHearts(prev => Math.min(prev + 1, 5))
            }
          })
          .catch(() => toast.error('Something went wrong.Please try again.'))
      })
    } else {
      startTransition(() => {
        reduceHearts(currentChallenge.id)
          .then(response => {
            if (response?.error === 'hearts') {
              openHeartsModal()
              return
            }

            incorrectControls.play()
            setStatus('wrong')

            if (!response?.error) {
              setHearts(prev => Math.max(prev - 1, 0))
            }
          })
          .catch(() => toast.error('Something went wrong.Please try again.'))
      })
    }
  }

  if (!currentChallenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className='mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8'>
          <Image
            src='/finish.svg'
            alt='Finish'
            className='hidden lg:block'
            height={100}
            width={100}
          />
          <Image
            src='/finish.svg'
            alt='Finish'
            className='block lg:hidden'
            height={50}
            width={50}
          />
          <h1 className='text-xl font-bold text-neutral-700 lg:text-3xl'>
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className='flex w-full items-center gap-x-4'>
            <ResultCard variant='points' value={challenges.length * 10} />
            <ResultCard variant='hearts' value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status='completed'
          onCheck={() => router.push('/learn')}
        />
      </>
    )
  }

  const title =
    currentChallenge.type === 'ASSIST'
      ? 'Select the correct meaning'
      : currentChallenge.question

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className='flex-1'>
        <div className='flex h-full items-center justify-center'>
          <div className='flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0'>
            <h1 className='text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl'>
              {title}
            </h1>
            <div>
              {currentChallenge.type === 'ASSIST' && (
                <QuestionBubble question={currentChallenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={currentChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  )
}

export default Quiz

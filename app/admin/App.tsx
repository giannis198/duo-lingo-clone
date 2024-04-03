'use client'

import { Admin, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'

import { CourseList } from './course/CourseList'
import { CourseEdit } from './course/CourseEdit'
import { CourseCreate } from './course/CourseCreate'

import { UnitList } from './unit/UnitList'
import { UnitCreate } from './unit/UnitCreate'
import { UnitEdit } from './unit/UnitEdit'

import { LessonList } from './lesson/LessonList'
import { LessonCreate } from './lesson/LessonCreate'
import { LessonEdit } from './lesson/LessonEdit'

import { ChallengeList } from './challenge/ChallengeList'
import { ChallengeCreate } from './challenge/ChallengeCreate'
import { ChallengeEdit } from './challenge/ChallengeEdit'
import { ChallengeOptionList } from './challengeOption/ChallengeOptionList'
import { ChallengeOptionCreate } from './challengeOption/ChallengeOptionCreate'
import { ChallengeOptionEdit } from './challengeOption/ChallengeOptionEdit'

const dataProvider = simpleRestProvider('/api')

const App = () => {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource
        name='courses'
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
        recordRepresentation='title'
      />
      <Resource
        name='units'
        list={UnitList}
        create={UnitCreate}
        edit={UnitEdit}
        recordRepresentation='title'
      />
      <Resource
        name='lessons'
        list={LessonList}
        create={LessonCreate}
        edit={LessonEdit}
        recordRepresentation='title'
      />
      <Resource
        name='challenges'
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
        recordRepresentation='question'
      />
      <Resource
        name='challengeOptions'
        list={ChallengeOptionList}
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        recordRepresentation='text'
        options={{ label: 'Challenge Options' }}
      />
    </Admin>
  )
}

export default App

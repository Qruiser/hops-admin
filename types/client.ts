export interface Client {
  id: string
  name: string
  about: string
  activeRoles: number
  deployedRoles: number
}

export interface Qru {
  id: string
  name: string
  clientId: string
  isContract: boolean
  isArchived: boolean
}

export interface QRate {
  id: string
  title: string
  qruId: string
  clientId: string
  isPrincipal: boolean
  isFullTime: boolean
  isArchived: boolean
}

export interface Role {
  id: string
  title: string
  teamId: string
  clientId: string
  isPrincipal: boolean
  isFullTime: boolean
  isArchived: boolean
}

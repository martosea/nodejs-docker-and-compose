export enum WishesLimits {
  latest = 40,
  mostCopied = 20,
}

export enum WishErrors {
  NotFound = 'Желание не найдено',
  NotOwner = 'Вы не владелец этого желания',
  OwnWishCopy = 'Вы не можете скопировать собственное желание',
  CannotChangePrice = 'Нельзя изменить цену: уже собраны средства',
}

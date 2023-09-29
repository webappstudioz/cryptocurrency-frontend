export const customRegex = {
  userName: /^[A-Za-z ]*$/,
  name: /^[A-Za-z]+$/,
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  spaces: /(?!^ +$)^.+$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  cardNumberRegex: /^((4\d{3})|(5[1-5]\d{2})|(6011)|(34\d{1})|(37\d{1}))-?\s?\d{4}-?\s?\d{4}-?\s?\d{4}|3[4,7][\d\s-]{15}$/,
  expirydate: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
  amount: /^\d+(\.\d{1,2})?$/,
  ipAddress: /^([0-9]{1,3}\.){3}[0-9]{1,3}$/,
  sshKey: /^ssh-rsa\s+[A-Za-z0-9+/]+[=]{0,3}(\s+.+)?\s*$/,
  mbSizeRegex :/^(\*|\d+)$/, //star or only digits
  onlyDigitsRegex: /^[0-9]*$/, // Only allow digits
  phoneNumber: /^([+]\d{2})?\d{10}$/,
  address: /^[a-zA-Z0-9\s\,\#\.\''\-]*(?!\s)*[a-z A-Z].*$/,
  hostNameRegex1: /^[a-zA-Z0-9]+[.][a-zA-Z0-9]+$/, //regex for hostname of subdomain name
  hostNameRegex2: /(?:[\s.])([a-z0-9][a-z0-9-]+[a-z0-9]\.redswitches\.net)/, //regex for hostname of subdomain name
  //  cardNumberRegex : /^(?:4[0-9]{12}(?:[0-9]{3})? | 5[1-5][0-9]{14} | 3[47][0-9]{13} | 3(?:0[0-5]|[68][0-9])[0-9]{11} | 6(?:011|5[0-9]{2})[0-9]{12} | (?:2131|1800|35\d{3})\d{11}) $/,
  //   cardNumberRegex:
  //     /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
  // sshKey: /^ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ[0-9A-Za-z\/+=]+\s?[^\s@]+@[^\s@]+$/,
  // sshKey: /^(ssh-(rsa|dss|ed25519|ecdsa))\s+[A-Za-z0-9+/]+(={0,2})\s+[^@]+@[^@]+$/,
  // sshKey: /^ssh-rsa\s+[A-Za-z0-9+/]+[A-Za-z0-9+/]+[A-Za-z0-9+/]+\s+.*$/
}

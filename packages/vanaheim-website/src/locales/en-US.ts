const data: {
  [key: string]: string;
} = {
  Workspace: '',
  Home: '',
  'Add Workspace': '',
  'Workspace Name': '',
};

Object.keys(data).forEach((key: string) => {
  data[key] = key;
});

export default data;

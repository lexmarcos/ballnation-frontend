// create methods based on fetch api
export const get = async (url: string) => {
  const res = await fetch(url);
  return res;
};

export const post = async (url: string, data: any) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};

export const put = async (url: string, data: any) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return res;
};

export const remove = async (url: string) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  });
  return res;
};

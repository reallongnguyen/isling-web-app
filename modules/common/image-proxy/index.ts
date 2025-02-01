export function viewImage(url: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/image-proxy?url=${url}`;
}

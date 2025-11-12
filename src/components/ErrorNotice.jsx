export default function ErrorNotice({ className, errorMsg }) {
  return <div className={`${className ? className : ''} bg-red-300`}>{errorMsg}</div>;
}

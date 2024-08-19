import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter'
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx'
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import COPY_ICON from '../../assets/icons/copy.svg'
import CLIPBOARD_ICON from '../../assets/icons/clipboard.svg'
import { useEffect, useState } from 'react'
import { IconButton } from '../IconButton'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faClipboard} from "@fortawesome/free-regular-svg-icons"
import {faCheck} from "@fortawesome/free-solid-svg-icons"

SyntaxHighlighter.registerLanguage("jsx", jsx)

export default function Code({children, className}) {
    const [isCopied, setIsCopied] = useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsCopied(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [isCopied])
    const language = className?.split("-")[1]
    return (
      <div className="code">
        <CopyToClipboard text={children} onCopy={() => setIsCopied(true)}>
          <IconButton
            icon={
              isCopied ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faClipboard} />
              )
            }
          />
        </CopyToClipboard>
        <SyntaxHighlighter language={language} style={atomDark}>
          {children}
        </SyntaxHighlighter>
      </div>
    );
}
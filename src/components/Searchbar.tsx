'use client';
import * as React from 'react';
import { Field } from '@base-ui/react/field';
import { Form } from '@base-ui/react/form';
import { Button } from '@base-ui/react/button';

type SearchbarProps = {
  name?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onSearch?: (query: string) => void | Promise<void>;
};

export default function Searchbar({
  name = 'search',
  placeholder = 'Search',
  buttonText = 'Search',
  className,
  inputClassName,
  buttonClassName,
  onSearch,
}: SearchbarProps) {
  const [errors, setErrors] = React.useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = React.useState(false);
  
  const formClassName = [
    'flex min-w-0 flex-1 items-start gap-2 sm:gap-3',
    className ?? 'sm:max-w-80',
  ].join(' ');
  const controlClassName = [
    'h-8 w-full border border-neutral-950 bg-white px-2 text-sm any-pointer-coarse:text-base font-normal text-neutral-950 placeholder:text-neutral-500 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950',
    inputClassName,
  ].filter(Boolean).join(' ');
  const submitButtonClassName = [
    'flex h-8 items-center justify-center gap-2 rounded-none border border-neutral-950 bg-white px-3 text-sm leading-none whitespace-nowrap font-normal text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 data-disabled:border-neutral-500 data-disabled:text-neutral-500 disabled:border-neutral-500 disabled:text-neutral-500',
    buttonClassName,
  ].filter(Boolean).join(' ');

  return (
    <Form
      className={formClassName}
      errors={errors}
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get(name)?.toString().trim() ?? '';

        if (!query) {
          setErrors({ [name]: 'Enter a search term' });
          return;
        }

        setErrors({});
        setLoading(true);

        try {
          await onSearch?.(query);
        } finally {
          setLoading(false);
        }
      }}
    >
      <Field.Root name={name} className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <Field.Control
          type="search"
          required
          placeholder={placeholder}
          className={controlClassName}
        />
        <Field.Error className="text-sm text-red-700" />
      </Field.Root>
      <Button
        disabled={loading}
        focusableWhenDisabled
        type="submit"
        className={submitButtonClassName}
      >
        {buttonText}
      </Button>
    </Form>
  );
}

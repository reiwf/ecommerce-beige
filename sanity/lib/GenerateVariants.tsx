import { Stack, Button } from '@sanity/ui'
import { ResetIcon, SparklesIcon } from '@sanity/icons'
import { randomKey } from '@sanity/util/content'
import { useCallback } from 'react'
import { ArrayOfObjectsInputProps, set, insert, setIfMissing, useFormValue } from 'sanity'

type Variant = {
    _key: string,
    _type: string,
    name: string,
    values: string[]
}

type VariantOptions = {
    name: string, value: string
}

export function GenerateVariants(props: ArrayOfObjectsInputProps) {
    const { onChange } = props

    // These values are used when creating a unique variant key
    const documentId = useFormValue(["_id"]) as string;
    const publishedDocumentId = documentId.includes('draft.') ? documentId.replace('draft.', '') : documentId;

    const variantOptions = useFormValue(['options']) as Variant[];

    // Helper function for generating all combinations of option values
    const cartesianProduct = (arr: {name: string, value: string }[][]): {name: string, value: string}[][] => {
        return arr.reduce<{name: string, value: string}[][]>((a, b) => {
            return a.map(x => b.map(y => x.concat([y]))).reduce((c, d) => c.concat(d), []);
        }, [[]]);
    };

    // Create a variant name for each combination of option values
    const generateVariantName = (variantOptions: VariantOptions[]) => {
        return variantOptions.map(option => `${option.name}: ${option.value}`).join(', ');
    };

    const handleClick = useCallback(() => {
        // Here create a variant key by appending the document id to the options combination ensure uniqueness across variants
        const generateVariantKey = (variantOptions: VariantOptions[]) => {
            return variantOptions.map(option => `${option.name}:${option.value}`).join('|') + '+' + publishedDocumentId;
        };

        const optionValues = variantOptions.map(opt => opt.values.map(v => ({ name: opt.name, value: v })));

        // Generate all combinations of option values
        const variants = cartesianProduct(optionValues).map((variant) => {
            const variantKey = generateVariantKey(variant);
            const variantName = generateVariantName(variant)

            // Assign a random key to each option in the variant
            const optionsWithKeys = variant.map(option => ({
                ...option,
                _key: randomKey(12)
            }));

            return {
                variantName: variantName,
                _type: 'variant',
                _key: variantKey,
                options: optionsWithKeys,
                quantity: 0
            };
        });

        // Individually insert items to append to the end of the array
        const variantPatches = variants.map((variant) =>
            insert([variant], 'after', [-1])
        )

        // Patch the document with the new variants array
        //
        // First clear out existing variants if case we're regenerating
        onChange(set([]))
        // Then set the new variants
        onChange([setIfMissing([]), ...variantPatches])
    },[onChange, publishedDocumentId, variantOptions])

    // Clear out existing variants
    const handleClear = useCallback(() => {onChange(set([]))},[onChange])

    return (
        <Stack space={3}>
            <Button icon={SparklesIcon} text='Generate Variants' mode='ghost' onClick={handleClick} />
            {props.renderDefault(props)}
            <Button icon={ResetIcon} text='Clear Variants' mode='ghost' onClick={handleClear} />
        </Stack>
    )
}